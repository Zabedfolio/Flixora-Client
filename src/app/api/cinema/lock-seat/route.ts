import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { showtimeId, hallId, date, time, seatId, userId, groupCode, userName, userEmail, action } = body;

    if (!showtimeId || !seatId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const lockKey = `${showtimeId}:${seatId}`;

    // Clean up expired locks first
    await db.collection('seat_locks').deleteMany({ expiresAt: { $lte: new Date() } });

    if (action === 'release') {
      await db.collection('seat_locks').deleteMany({
        lockKey,
      });

      if (groupCode) {
        const cleanCode = groupCode.toUpperCase();
        await db.collection('group_bookings').updateOne(
          { $or: [{ groupCode }, { groupCode: cleanCode }] },
          { $pull: { groupSeatPool: seatId } as any }
        );
        await db.collection('group_members').updateMany(
          { $or: [{ groupCode }, { groupCode: cleanCode }] },
          { $pull: { selectedSeats: seatId } as any }
        );
      }

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

    // Check if locked by another user (unless in same group)
    const existingLock = await db.collection('seat_locks').findOne({ lockKey });
    if (
      existingLock &&
      existingLock.userId !== userId &&
      new Date(existingLock.expiresAt) > new Date()
    ) {
      // Allow lock transfer if within same group session
      if (!groupCode || existingLock.groupCode !== groupCode) {
        return NextResponse.json(
          { success: false, message: `Seat ${seatId} is currently held by another customer.` },
          { status: 409 }
        );
      }
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
          groupCode: groupCode || null,
          userName: userName || null,
          expiresAt,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Synchronize seat selection into group_bookings and group_members
    if (groupCode) {
      const cleanCode = groupCode.toUpperCase();
      await db.collection('group_bookings').updateOne(
        { $or: [{ groupCode }, { groupCode: cleanCode }] },
        { $addToSet: { groupSeatPool: seatId } as any }
      );
      if (userId) {
        await db.collection('group_members').updateOne(
          { $and: [{ $or: [{ groupCode }, { groupCode: cleanCode }] }, { $or: [{ userId }, { userEmail }] }] },
          {
            $addToSet: { selectedSeats: seatId } as any,
            $set: {
              userName: userName || 'Cinema Customer',
              userEmail: userEmail || 'customer@flixora.com',
              joinedAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seat ${seatId} locked for 10 minutes`,
      expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
