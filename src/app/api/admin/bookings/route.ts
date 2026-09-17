import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    // Fetch bookings from both `bookings` and `tickets` collections
    let bookings = await db
      .collection('bookings')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    if (!bookings || bookings.length === 0) {
      bookings = await db
        .collection('tickets')
        .find({})
        .sort({ createdAt: -1, purchaseDate: -1 })
        .toArray();
    }

    if (!bookings || bookings.length === 0) {
      bookings = await db
        .collection('cinema_tickets')
        .find({})
        .sort({ createdAt: -1, purchaseDate: -1 })
        .toArray();
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin bookings' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const ticketId = searchParams.get('ticketId') || '';
    const bookingId = searchParams.get('bookingId') || '';

    if (!ticketId && !bookingId) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID or Booking ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Find the target booking
    let targetBooking = await db.collection('bookings').findOne({
      $or: [{ ticketId }, { bookingId }],
    });

    if (!targetBooking) {
      targetBooking = await db.collection('tickets').findOne({
        $or: [{ ticketId }, { bookingId }],
      });
    }

    if (!targetBooking) {
      targetBooking = await db.collection('cinema_tickets').findOne({
        $or: [{ ticketId }, { bookingId }],
      });
    }

    if (!targetBooking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    const targetTicketId = targetBooking.ticketId || ticketId;
    const targetBookingId = targetBooking.bookingId || bookingId;
    const showtimeId = targetBooking.showtimeId;
    const seats = targetBooking.seatNumbers || targetBooking.seats || [];

    // 1. Update status to 'cancelled' across all ticket/booking collections
    await db.collection('bookings').updateMany(
      { $or: [{ ticketId: targetTicketId }, { bookingId: targetBookingId }] },
      { $set: { status: 'cancelled', cancelledAt: new Date().toISOString() } }
    );

    await db.collection('tickets').updateMany(
      { $or: [{ ticketId: targetTicketId }, { bookingId: targetBookingId }] },
      { $set: { status: 'cancelled', cancelledAt: new Date().toISOString() } }
    );

    await db.collection('cinema_tickets').updateMany(
      { $or: [{ ticketId: targetTicketId }, { bookingId: targetBookingId }] },
      { $set: { status: 'cancelled', cancelledAt: new Date().toISOString() } }
    );

    // 2. Release booked seats in cinema_seats collection if showtimeId & seats exist
    if (showtimeId && Array.isArray(seats) && seats.length > 0) {
      await db.collection('cinema_seats').updateMany(
        { showtimeId, seatId: { $in: seats } },
        {
          $set: {
            isBooked: false,
            heldBy: null,
            heldAt: null,
            bookedBy: null,
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${targetTicketId} cancelled successfully and seats released.`,
      ticketId: targetTicketId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
