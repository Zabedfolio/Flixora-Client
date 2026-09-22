import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CINEMA_HALLS_DATA, generateParabolicSeats } from '@/data/cinemaData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const showtimeId = searchParams.get('showtimeId') || '';
    const hallId = searchParams.get('hallId') || 'hall-star-sks';
    const userId = searchParams.get('userId') || '';
    const groupCode = searchParams.get('groupCode') || '';

    const hall = CINEMA_HALLS_DATA.find((h) => h.id === hallId) || CINEMA_HALLS_DATA[0];

    let bookedSeatIds: string[] = [];
    let heldSeatIds: string[] = [];
    let myHeldSeats: string[] = [];
    let groupHeldSeats: string[] = [];

    try {
      const { db } = await connectToDatabase();

      // Clean up expired locks first
      await db.collection('seat_locks').deleteMany({ expiresAt: { $lte: new Date() } });

      // Fetch permanent confirmed tickets for this showtime across all database collections
      const tickets = await db
        .collection('tickets')
        .find({
          $or: [{ showtimeId }, { hallId: hall.id }],
          status: { $nin: ['cancelled', 'Cancelled'] },
        })
        .toArray();

      const bookings = await db
        .collection('bookings')
        .find({
          $or: [{ showtimeId }, { hallId: hall.id }],
          status: { $nin: ['cancelled', 'Cancelled'] },
        })
        .toArray();

      const legacyTickets = await db
        .collection('cinema_tickets')
        .find({
          $or: [{ showtimeId }, { hallId: hall.id }],
          status: { $nin: ['cancelled', 'Cancelled'] },
        })
        .toArray();

      [...tickets, ...bookings, ...legacyTickets].forEach((t: any) => {
        const seatsArr = t.seatNumbers || t.seats || [];
        if (Array.isArray(seatsArr)) {
          bookedSeatIds.push(...seatsArr);
        }
      });

      if (groupCode) {
        const cleanGroupCode = groupCode.toUpperCase();
        const groupBooking = await db.collection('group_bookings').findOne({
          $or: [{ groupCode }, { groupCode: cleanGroupCode }],
        });
        if (groupBooking && Array.isArray(groupBooking.paidSeats)) {
          bookedSeatIds.push(...groupBooking.paidSeats);
        }

        const paidMembers = await db
          .collection('group_members')
          .find({
            $or: [{ groupCode }, { groupCode: cleanGroupCode }],
            paymentStatus: 'paid',
          })
          .toArray();

        paidMembers.forEach((m: any) => {
          if (Array.isArray(m.paidSeats)) {
            bookedSeatIds.push(...m.paidSeats);
          } else if (Array.isArray(m.selectedSeats)) {
            bookedSeatIds.push(...m.selectedSeats);
          }
        });
      }

      // Fetch active seat holds
      const activeLocks = await db
        .collection('seat_locks')
        .find({
          showtimeId,
          expiresAt: { $gt: new Date() },
        })
        .toArray();

      activeLocks.forEach((lock: any) => {
        heldSeatIds.push(lock.seatId);
        if (userId && lock.userId === userId) {
          myHeldSeats.push(lock.seatId);
        }
        if (groupCode && lock.groupCode === groupCode) {
          groupHeldSeats.push(lock.seatId);
        }
      });
    } catch (dbErr) {
      console.warn('MongoDB seat status fetch warning:', dbErr);
    }

    const seats = generateParabolicSeats(hall, bookedSeatIds);

    // Apply held status
    seats.forEach((seat) => {
      if (seat.status !== 'booked' && heldSeatIds.includes(seat.id)) {
        seat.status = myHeldSeats.includes(seat.id) ? 'selected' : 'held';
      }
    });

    return NextResponse.json({
      success: true,
      showtimeId,
      hall,
      seats,
      bookedSeatIds,
      heldSeatIds,
      myHeldSeats,
      groupHeldSeats,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
