import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { showtimeId, hallId, date, time, seatId, userId, action } = body;

    if (!showtimeId || !seatId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const lockKey = `${showtimeId}:${seatId}`;

    // Clean up expired locks first
    await db.collection('seat_locks').deleteMany({ expiresAt: { $lte: new Date() } });

    if (action === 'release') {
      await db.collection('seat_locks').deleteOne({ lockKey, userId });
      return NextResponse.json({ success: true, message: `Seat ${seatId} released` });
    }

    // Check if seat is permanently booked in any collection
    const existingTicket = await db.collection('tickets').findOne({
      showtimeId,
      $or: [{ seatNumbers: seatId }, { seats: seatId }],
      status: { $nin: ['cancelled', 'Cancelled'] },
    });

    const existingBooking = await db.collection('bookings').findOne({
      showtimeId,
      seatNumbers: seatId,
      status: { $nin: ['cancelled', 'Cancelled'] },
    });

    const existingLegacy = await db.collection('cinema_tickets').findOne({
      showtimeId,
      seatNumbers: seatId,
      status: { $nin: ['cancelled', 'Cancelled'] },
    });

    if (existingTicket || existingBooking || existingLegacy) {
      return NextResponse.json(
        { success: false, message: `Seat ${seatId} is already booked by another user.` },
        { status: 409 }
      );
    }

    // Check if locked by another user
    const existingLock = await db.collection('seat_locks').findOne({ lockKey });
    if (existingLock && existingLock.userId !== userId && new Date(existingLock.expiresAt) > new Date()) {
      return NextResponse.json(
        { success: false, message: `Seat ${seatId} is currently held by another customer.` },
        { status: 409 }
      );
    }

    // 10-Minute Hold Expiry (600 seconds)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection('seat_locks').updateOne(
      { lockKey },
      {
        $set: {
          lockKey,
          showtimeId,
          hallId,
          date,
          time,
          seatId,
          userId,
          expiresAt,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Seat ${seatId} locked for 10 minutes`,
      expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
