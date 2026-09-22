import { NextResponse } from 'next/server';
import { stripe } from '@/app/(auth)/lib/stripe';
import { connectToDatabase } from '@/lib/mongodb';

function generateId(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = `${prefix}-`;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      titleId,
      movieTitle,
      moviePoster,
      hallId,
      hallName,
      hallAddress,
      district,
      showtimeId,
      date,
      time,
      seatNumbers,
      totalPrice,
      userId,
      groupCode,
      userName = 'Flixora User',
      userEmail = 'user@flixora.com',
    } = body;

    if (!titleId || !hallId || !showtimeId || !seatNumbers || seatNumbers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking parameters.' },
        { status: 400 }
      );
    }

    const bookingId = generateId('BKG');
    const ticketId = generateId('FLX');
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const qrCodeUrl = `${origin}/verify/${ticketId}`;

    const { db } = await connectToDatabase();

    // Verify if any requested seats have already been paid for by another participant
    const existingTicket = await db.collection('tickets').findOne({
      showtimeId,
      $or: [{ seatNumbers: { $in: seatNumbers } }, { seats: { $in: seatNumbers } }],
      status: { $nin: ['cancelled', 'Cancelled'] },
    });

    const existingBooking = await db.collection('bookings').findOne({
      showtimeId,
      seatNumbers: { $in: seatNumbers },
      status: { $nin: ['cancelled', 'Cancelled'] },
    });

    if (existingTicket || existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            'One or more of the selected seats have already been paid for and confirmed by another member!',
        },
        { status: 409 }
      );
    }

    if (groupCode) {
      const groupDoc = await db.collection('group_bookings').findOne({
        $or: [{ groupCode }, { groupCode: groupCode.toUpperCase() }],
      });
      if (groupDoc && Array.isArray(groupDoc.paidSeats)) {
        const alreadyPaidSeats = seatNumbers.filter((s: string) => groupDoc.paidSeats.includes(s));
        if (alreadyPaidSeats.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message: `Seat(s) ${alreadyPaidSeats.join(', ')} have already been paid for!`,
            },
            { status: 409 }
          );
        }
      }
    }

    // 1. Store record in `bookings` collection
    const bookingRecord = {
      bookingId,
      ticketId,
      userId: userId || 'guest_user',
      userName,
      userEmail,
      titleId,
      movieTitle: movieTitle || 'Featured Cinema Title',
      moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      district: district || 'Dhaka',
      hallId,
      hallName: hallName || 'Star Cineplex',
      hallAddress: hallAddress || 'Dhaka, Bangladesh',
      showtimeId,
      date,
      time,
      seatNumbers,
      totalPrice: Number(totalPrice) || 0,
      groupCode: groupCode || null,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    await db.collection('bookings').insertOne(bookingRecord);

    // 2. Store record in `tickets` collection
    const ticketRecord = {
      ticketId,
      bookingId,
      userId: userId || 'guest_user',
      userName,
      userEmail,
      titleId,
      movieTitle: movieTitle || 'Featured Cinema Title',
      moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      district: district || 'Dhaka',
      hallId,
      hallName: hallName || 'Star Cineplex',
      hallAddress: hallAddress || 'Dhaka, Bangladesh',
      showtimeId,
      date,
      time,
      seats: seatNumbers,
      seatNumbers,
      totalPrice: Number(totalPrice) || 0,
      qrCode: qrCodeUrl,
      groupCode: groupCode || null,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    await db.collection('tickets').insertOne(ticketRecord);
    await db.collection('cinema_tickets').insertOne(ticketRecord); // legacy table fallback

    // Release temporary seat locks matching these seats
    await db.collection('seat_locks').deleteMany({
      showtimeId,
      seatId: { $in: seatNumbers },
    });

    if (groupCode) {
      await db.collection('group_members').updateOne(
        { groupCode, $or: [{ userId }, { userEmail }] },
        {
          $set: {
            paymentStatus: 'paid',
            ticketId,
            paidSeats: seatNumbers,
            paidAt: new Date().toISOString(),
            payerName: userName,
          },
        },
        { upsert: true }
      );

      await db.collection('group_bookings').updateOne(
        { groupCode },
        {
          $addToSet: { paidSeats: { $each: seatNumbers } } as any,
          $set: { updatedAt: new Date().toISOString() },
        }
      );
    }

    // 3. Mark seats as Booked in cinema_seats collection
    await db.collection('cinema_seats').updateMany(
      { showtimeId, seatId: { $in: seatNumbers } },
      {
        $set: {
          isBooked: true,
          heldBy: null,
          heldAt: null,
          bookedBy: userId,
          updatedAt: new Date(),
        },
      }
    );

    // 4. Initialize Stripe Checkout Session
    const unitAmount = Math.max(Math.round((Number(totalPrice) || 500) * 100), 50);

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'bdt',
            product_data: {
              name: `Flixora Cinema Pass: ${movieTitle}`,
              description: `${hallName} (${district}) — ${date} @ ${time} [Seats: ${seatNumbers.join(', ')}]`,
              images: moviePoster ? [moviePoster] : [],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/tickets/${ticketId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book/${titleId}/seats?hallId=${hallId}&showtimeId=${showtimeId}&date=${date}&time=${encodeURIComponent(time)}`,
      metadata: {
        bookingId,
        ticketId,
        titleId,
        movieTitle,
        hallId,
        showtimeId,
        seats: seatNumbers.join(','),
      },
    };

    if (userEmail && userEmail.includes('@') && !userEmail.includes('user@flixora.com')) {
      sessionParams.customer_email = userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      success: true,
      url: session.url,
      ticketId,
      bookingId,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Stripe checkout creation error:', error);
    
    // Fallback USD or direct ticket creation if BDT not allowed on test key
    try {
      const body = await request.json();
      const {
        titleId,
        movieTitle,
        moviePoster,
        hallId,
        hallName,
        hallAddress,
        district,
        showtimeId,
        date,
        time,
        seatNumbers,
        totalPrice,
        userId,
        userName = 'Flixora User',
        userEmail = 'user@flixora.com',
      } = body;

      const bookingId = generateId('BKG');
      const ticketId = generateId('FLX');
      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const qrCodeUrl = `${origin}/verify/${ticketId}`;

      const { db } = await connectToDatabase();

      const bookingRecord = {
        bookingId,
        ticketId,
        userId: userId || 'guest_user',
        userName,
        userEmail,
        titleId,
        movieTitle: movieTitle || 'Featured Cinema Title',
        moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
        district: district || 'Dhaka',
        hallId,
        hallName: hallName || 'Star Cineplex',
        hallAddress: hallAddress || 'Dhaka, Bangladesh',
        showtimeId,
        date,
        time,
        seatNumbers,
        totalPrice: Number(totalPrice) || 0,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      await db.collection('bookings').insertOne(bookingRecord);

      const ticketRecord = {
        ticketId,
        bookingId,
        userId: userId || 'guest_user',
        userName,
        userEmail,
        titleId,
        movieTitle: movieTitle || 'Featured Cinema Title',
        moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
        district: district || 'Dhaka',
        hallId,
        hallName: hallName || 'Star Cineplex',
        hallAddress: hallAddress || 'Dhaka, Bangladesh',
        showtimeId,
        date,
        time,
        seats: seatNumbers,
        seatNumbers,
        totalPrice: Number(totalPrice) || 0,
        qrCode: qrCodeUrl,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await db.collection('tickets').insertOne(ticketRecord);
      await db.collection('cinema_tickets').insertOne(ticketRecord);

      const usdAmount = Math.max(Math.round((Number(totalPrice) / 120) * 100), 100);
      const fallbackParams: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Flixora Cinema Pass: ${movieTitle}`,
                description: `${hallName} — ${date} @ ${time} [Seats: ${seatNumbers.join(', ')}]`,
              },
              unit_amount: usdAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/tickets/${ticketId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/book/${titleId}/seats?hallId=${hallId}&showtimeId=${showtimeId}&date=${date}&time=${encodeURIComponent(time)}`,
      };

      if (userEmail && userEmail.includes('@') && !userEmail.includes('user@flixora.com')) {
        fallbackParams.customer_email = userEmail;
      }

      const session = await stripe.checkout.sessions.create(fallbackParams);

      return NextResponse.json({
        success: true,
        url: session.url,
        ticketId,
        bookingId,
        sessionId: session.id,
      });
    } catch (fallbackErr: any) {
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to initialize Stripe checkout session' },
        { status: 500 }
      );
    }
  }
}
