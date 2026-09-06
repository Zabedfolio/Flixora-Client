import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, activeSeconds = 30, eventType = 'heartbeat', metadata = {} } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'sessionId is required' }, { status: 400 });
    }

    let userId: string | null = null;
    try {
      const authSession = await auth.api.getSession({
        headers: await headers(),
      });
      if (authSession?.user?.id) {
        userId = authSession.user.id;
      }
    } catch {
      // Unauthenticated session tracking
    }

    const { db } = await connectToDatabase();
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
    const hourOfDay = now.getHours(); // 0 - 23

    // Update or insert session document in MongoDB user_sessions collection
    await db.collection('user_sessions').updateOne(
      { sessionId },
      {
        $set: {
          sessionId,
          userId: userId || 'anonymous',
          lastActiveAt: now,
          dayOfWeek,
          hourOfDay,
        },
        $inc: {
          totalActiveSeconds: eventType === 'heartbeat' ? activeSeconds : 0,
          trailerClicks: eventType === 'trailer_click' ? 1 : 0,
          moviePlays: eventType === 'movie_play' ? 1 : 0,
        },
        $setOnInsert: {
          createdAt: now,
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Session telemetry recorded' });
  } catch (error: any) {
    console.error('POST /api/telemetry/session error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
