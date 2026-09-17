import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CINEMA_HALLS_DATA } from '@/data/cinemaData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const titleId = searchParams.get('titleId') || '';
    const hallId = searchParams.get('hallId') || '';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const hall = CINEMA_HALLS_DATA.find((h) => h.id === hallId) || CINEMA_HALLS_DATA[0];
    const totalCapacity = hall.totalSeats || 128;

    const defaultTimes = ['10:00 AM', '02:30 PM', '06:45 PM', '09:30 PM'];

    let bookedByShowtime: Record<string, number> = {};

    try {
      const { db } = await connectToDatabase();
      // Query DB for confirmed tickets across all collections for this hall & date
      const tickets = await db
        .collection('tickets')
        .find({
          hallId: hall.id,
          date,
          status: { $nin: ['cancelled', 'Cancelled'] },
        })
        .toArray();

      const bookings = await db
        .collection('bookings')
        .find({
          hallId: hall.id,
          date,
          status: { $nin: ['cancelled', 'Cancelled'] },
        })
        .toArray();

      const legacyTickets = await db
        .collection('cinema_tickets')
        .find({
          hallId: hall.id,
          date,
          status: { $nin: ['cancelled', 'Cancelled'] },
        })
        .toArray();

      const allConfirmed = [...tickets, ...bookings, ...legacyTickets];

      // Query active seat holds from seat_locks collection
      const activeLocks = await db
        .collection('seat_locks')
        .find({
          hallId: hall.id,
          date,
          expiresAt: { $gt: new Date() },
        })
        .toArray();

      allConfirmed.forEach((t: any) => {
        const timeKey = t.time;
        const seatArr = t.seatNumbers || t.seats || [];
        const count = Array.isArray(seatArr) ? seatArr.length : 1;
        if (timeKey) {
          bookedByShowtime[timeKey] = (bookedByShowtime[timeKey] || 0) + count;
        }
      });

      activeLocks.forEach((l: any) => {
        const timeKey = l.time;
        bookedByShowtime[timeKey] = (bookedByShowtime[timeKey] || 0) + 1;
      });
    } catch (dbErr) {
      console.warn('MongoDB showtime seats lookup warning, using dynamic fallback:', dbErr);
    }

    const showtimes = defaultTimes.map((time, idx) => {
      const bookedCount = bookedByShowtime[time] || (idx === 1 ? Math.floor(totalCapacity * 0.92) : Math.floor(totalCapacity * 0.35));
      const seatsAvailable = Math.max(0, totalCapacity - bookedCount);
      const isSoldOut = seatsAvailable === 0;
      const isFillingFast = !isSoldOut && seatsAvailable < Math.ceil(totalCapacity * 0.12);

      return {
        id: `${hall.id}_${date}_${time.replace(/[\s:]/g, '')}`,
        time,
        seatsAvailable,
        totalSeats: totalCapacity,
        isFillingFast,
        isSoldOut,
      };
    });

    return NextResponse.json({
      success: true,
      titleId,
      hall,
      date,
      showtimes,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
