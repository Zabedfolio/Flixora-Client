import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

function generateGroupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'FLX-GRP-';
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
      showtimeId,
      date,
      time,
      selectedSeats = [],
      paymentMode = 'individual',
      userId: bodyUserId,
      userName: bodyUserName,
      userEmail: bodyUserEmail,
    } = body;

    if (!titleId || !hallId || !showtimeId) {
      return NextResponse.json(
        { success: false, message: 'Missing required showtime parameters for group booking.' },
        { status: 400 }
      );
    }

    // Authenticate user session
    let session: any = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (err) {
      // fallback
    }

    const leaderUserId = session?.user?.id || bodyUserId || `user_${Math.random().toString(36).substring(2, 9)}`;
    const leaderName = session?.user?.name || bodyUserName || 'Cinema Customer';
    const leaderEmail = session?.user?.email || bodyUserEmail || 'customer@flixora.com';

    const { db } = await connectToDatabase();

    const groupCode = generateGroupCode();
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const shareUrl = `${origin}/book/${titleId}/seats?hallId=${encodeURIComponent(hallId)}&showtimeId=${encodeURIComponent(showtimeId)}&date=${encodeURIComponent(date || '')}&time=${encodeURIComponent(time || '')}&groupCode=${groupCode}`;

    // 15-minute group session window
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const groupDoc = {
      groupCode,
      leaderUserId,
      leaderName,
      leaderEmail,
      titleId,
      movieTitle: movieTitle || 'Featured Cinema Title',
      moviePoster: moviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      hallId,
      hallName: hallName || 'Star Cineplex',
      showtimeId,
      date: date || '',
      time: time || '',
      groupSeatPool: Array.isArray(selectedSeats) ? selectedSeats : [],
      paymentMode,
      status: 'active',
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('group_bookings').insertOne(groupDoc);

    // Insert Leader into group_members
    await db.collection('group_members').updateOne(
      { groupCode, userId: leaderUserId },
      {
        $set: {
          groupCode,
          userId: leaderUserId,
          userName: leaderName,
          userEmail: leaderEmail,
          selectedSeats: Array.isArray(selectedSeats) ? selectedSeats : [],
          paymentStatus: 'pending',
          isLeader: true,
          joinedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    // Also place seat locks under group context if seats provided
    if (Array.isArray(selectedSeats) && selectedSeats.length > 0) {
      for (const seatId of selectedSeats) {
        const lockKey = `${showtimeId}:${seatId}`;
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
              userId: leaderUserId,
              groupCode,
              expiresAt,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Group booking session created successfully!',
      groupCode,
      shareUrl,
      expiresAt,
      group: groupDoc,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
