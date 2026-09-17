import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const ticketId = searchParams.get('ticketId') || '';
    const paramUserId = searchParams.get('userId') || '';
    const paramEmail = searchParams.get('email') || '';

    const { db } = await connectToDatabase();

    // Authenticate requesting user
    let session: any = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (err) {
      // session fallback
    }

    const currentUserId = session?.user?.id || '';
    const currentUserEmail = (session?.user?.email || '').toLowerCase();
    let isUserAdmin = session?.user?.role === 'admin';

    if (session?.user?.id && !isUserAdmin) {
      const dbUser =
        (await db.collection('user').findOne({
          $or: [{ id: session.user.id }, { email: session.user.email }],
        })) ||
        (await db.collection('users').findOne({
          $or: [{ id: session.user.id }, { email: session.user.email }],
        }));

      if (dbUser?.role === 'admin') {
        isUserAdmin = true;
      }
    }

    if (ticketId) {
      // 1. Search in `tickets` collection first
      let ticket = await db.collection('tickets').findOne({
        $or: [{ ticketId }, { ticketId: ticketId.toUpperCase() }],
      });

      // 2. Search in `bookings` collection fallback
      if (!ticket) {
        const booking = await db.collection('bookings').findOne({
          $or: [{ ticketId }, { bookingId: ticketId }],
        });
        if (booking) {
          const origin = req.headers.get('origin') || 'http://localhost:3000';
          ticket = {
            ticketId: booking.ticketId || ticketId,
            bookingId: booking.bookingId,
            userId: booking.userId,
            userName: booking.userName,
            userEmail: booking.userEmail,
            movieTitle: booking.movieTitle,
            moviePoster: booking.moviePoster,
            hallName: booking.hallName,
            hallAddress: booking.hallAddress,
            district: booking.district,
            date: booking.date,
            time: booking.time,
            seats: booking.seatNumbers || booking.seats || [],
            seatNumbers: booking.seatNumbers || booking.seats || [],
            totalPrice: booking.totalPrice,
            qrCode: `${origin}/verify/${booking.ticketId || ticketId}`,
            status: booking.status === 'confirmed' ? 'active' : booking.status,
            createdAt: booking.createdAt,
          };
        }
      }

      // 3. Search in `cinema_tickets` legacy table fallback
      if (!ticket) {
        ticket = await db.collection('cinema_tickets').findOne({
          $or: [{ ticketId }, { ticketId: ticketId.toUpperCase() }],
        });
      }

      if (!ticket) {
        return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
      }

      // Flexible ownership & ticket pass access check
      const isGateVerify = searchParams.get('verify') === 'true' || searchParams.get('gate') === 'true';
      if (!isGateVerify && !isUserAdmin) {
        const ticketUserId = String(ticket.userId || '');
        const ticketUserEmail = String(ticket.userEmail || '').toLowerCase();

        const isOwner =
          !ticketUserId ||
          ticketUserId.startsWith('guest_') ||
          ticketUserEmail.includes('customer@flixora') ||
          (currentUserId && (ticketUserId === currentUserId || ticketUserId === String(session?.user?.id))) ||
          (currentUserEmail && (ticketUserEmail === currentUserEmail || ticketUserEmail === String(session?.user?.email).toLowerCase())) ||
          (!currentUserId && !currentUserEmail);

        if (!isOwner) {
          return NextResponse.json(
            {
              success: false,
              message: 'Access Denied: You do not have permission to view another user’s ticket pass.',
              accessDenied: true,
            },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ success: true, ticket });
    }

    // List user tickets logic
    const candidateUserIds = Array.from(
      new Set([paramUserId, currentUserId].filter(Boolean))
    );
    const candidateEmails = Array.from(
      new Set([paramEmail, currentUserEmail].filter(Boolean))
    );

    const conditions: any[] = [];
    candidateUserIds.forEach((uid) => {
      conditions.push({ userId: uid });
    });
    candidateEmails.forEach((email) => {
      conditions.push({
        userEmail: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      });
    });

    if (conditions.length === 0) {
      return NextResponse.json({ success: true, tickets: [] });
    }

    const query = { $or: conditions };

    const [ticketsFromTickets, ticketsFromBookings, ticketsFromCinema] = await Promise.all([
      db.collection('tickets').find(query).toArray(),
      db.collection('bookings').find(query).toArray(),
      db.collection('cinema_tickets').find(query).toArray(),
    ]);

    const ticketMap = new Map<string, any>();
    const allDocs = [...ticketsFromTickets, ...ticketsFromBookings, ...ticketsFromCinema];

    for (const doc of allDocs) {
      const id = doc.ticketId || doc.bookingId;
      if (!id) continue;

      if (!ticketMap.has(id)) {
        const seats = doc.seatNumbers || doc.seats || [];
        const rawStatus = (doc.status || '').toLowerCase();
        const status =
          rawStatus === 'confirmed' || rawStatus === 'active'
            ? 'Active'
            : rawStatus === 'used'
            ? 'Used'
            : rawStatus === 'cancelled'
            ? 'Cancelled'
            : 'Active';

        ticketMap.set(id, {
          _id: doc._id?.toString(),
          ticketId: id,
          bookingId: doc.bookingId || id,
          userId: doc.userId,
          userName: doc.userName || 'Cinema Customer',
          userEmail: doc.userEmail,
          titleId: doc.titleId,
          movieTitle: doc.movieTitle || 'Featured Cinema Movie',
          moviePoster: doc.moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
          district: doc.district || doc.location || 'Dhaka',
          hallName: doc.hallName || 'Star Cineplex',
          hallAddress: doc.hallAddress || 'Dhaka, Bangladesh',
          showtimeId: doc.showtimeId,
          date: doc.date || '',
          time: doc.time || '',
          seats: seats,
          seatNumbers: seats,
          totalPrice: doc.totalPrice || 0,
          qrCode: doc.qrCode || `http://localhost:3000/verify/${id}`,
          status: status,
          createdAt: doc.createdAt || doc.purchaseDate || new Date().toISOString(),
        });
      }
    }

    const tickets = Array.from(ticketMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, tickets });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, action } = body;

    if (!ticketId) {
      return NextResponse.json({ success: false, message: 'Ticket ID required' }, { status: 400 });
    }

    // Authenticate Admin / Staff User
    let session: any = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (err) {
      // silent
    }

    const { db } = await connectToDatabase();
    let ticket = await db.collection('tickets').findOne({ ticketId });
    if (!ticket) {
      ticket = await db.collection('cinema_tickets').findOne({ ticketId });
    }

    if (!ticket) {
      return NextResponse.json({ success: false, message: 'Invalid Ticket ID' }, { status: 404 });
    }

    if (action === 'verify' || !action) {
      if (ticket.status === 'used' || ticket.status === 'Used') {
        return NextResponse.json({
          success: false,
          status: 'Already Used',
          message: `Ticket ${ticketId} was already used on ${new Date(ticket.usedAt || ticket.verifiedAt || Date.now()).toLocaleTimeString()}`,
          ticket,
        });
      }

      const usedAt = new Date().toISOString();
      const verifiedBy = session?.user?.name || 'Staff Scanner';

      // Update in both `tickets`, `bookings`, and `cinema_tickets`
      await db.collection('tickets').updateMany(
        { ticketId },
        { $set: { status: 'used', usedAt, verifiedBy } }
      );
      await db.collection('bookings').updateMany(
        { ticketId },
        { $set: { status: 'used', usedAt, verifiedBy } }
      );
      await db.collection('cinema_tickets').updateMany(
        { ticketId },
        { $set: { status: 'used', usedAt, verifiedBy } }
      );

      const updatedTicket = { ...ticket, status: 'used', usedAt, verifiedBy };

      return NextResponse.json({
        success: true,
        status: 'Valid Ticket',
        message: `Ticket ${ticketId} marked as USED successfully!`,
        ticket: updatedTicket,
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
