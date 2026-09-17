import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

function generateShortTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'FLX-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
    } = body;

    if (!titleId || !hallId || !showtimeId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid ticket order details' }, { status: 400 });
    }

    // Authenticate User
    let session: any = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (err) {
      // Guest or fallback session
    }

    const userId = session?.user?.id || body.userId || `guest_${Date.now()}`;
    const userName = session?.user?.name || body.userName || 'Cinema Customer';
    const userEmail = session?.user?.email || body.userEmail || 'customer@flixora.com';

    const { db } = await connectToDatabase();

    // Verify seats aren't permanently booked by another user
    const existingConflict = await db.collection('cinema_tickets').findOne({
      showtimeId,
      seatNumbers: { $in: seatNumbers },
      status: { $ne: 'Cancelled' },
    });

    if (existingConflict) {
      return NextResponse.json(
        {
          success: false,
          message: 'One or more selected seats are no longer available. Please reselect your seats.',
        },
        { status: 409 }
      );
    }

    const ticketId = generateShortTicketCode();
    const bookingId = `BKG-${ticketId.replace('FLX-', '')}`;
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const qrCodeUrl = `${origin}/verify/${ticketId}`;

    const bookingRecord = {
      bookingId,
      ticketId,
      userId,
      userName,
      userEmail,
      titleId,
      movieTitle: movieTitle || 'Featured Cinema Title',
      moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      district: district || 'Dhaka',
      location: district || 'Dhaka',
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

    const ticketRecord = {
      ticketId,
      bookingId,
      userId,
      userName,
      userEmail,
      titleId,
      movieTitle: movieTitle || 'Featured Cinema Title',
      moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      district: district || 'Dhaka',
      location: district || 'Dhaka',
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
      purchaseDate: new Date(),
    };

    // Store records in both `bookings` and `tickets` collections in MongoDB
    await db.collection('bookings').insertOne(bookingRecord);
    await db.collection('tickets').insertOne(ticketRecord);
    await db.collection('cinema_tickets').insertOne(ticketRecord);

    // Remove temporary locks for these seats
    await db.collection('seat_locks').deleteMany({
      showtimeId,
      seatId: { $in: seatNumbers },
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket booked successfully!',
      ticketId,
      bookingId,
      ticket: ticketRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
