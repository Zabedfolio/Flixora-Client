import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const ticketId = searchParams.get('ticketId') || '';
    const userId = searchParams.get('userId') || '';

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
      const dbUser = await db.collection('users').findOne({
        $or: [{ id: session.user.id }, { email: session.user.email }],
      });
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
            seats: booking.seatNumbers || [],
            seatNumbers: booking.seatNumbers || [],
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

    if (userId) {
      // Search user tickets across `tickets` and `cinema_tickets`
      let tickets = await db
        .collection('tickets')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

      if (tickets.length === 0) {
        tickets = await db
          .collection('cinema_tickets')
          .find({ userId })
          .sort({ createdAt: -1, purchaseDate: -1 })
          .toArray();
      }

      return NextResponse.json({ success: true, tickets });
    }

    return NextResponse.json({ success: false, message: 'Missing ticketId or userId' }, { status: 400 });
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
