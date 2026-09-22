import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { groupCode, userId: bodyUserId, userName: bodyUserName, userEmail: bodyUserEmail } = body;

    if (!groupCode) {
      return NextResponse.json({ success: false, message: 'Group code required' }, { status: 400 });
    }

    // Authenticate session or fallback
    let session: any = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (err) {
      // fallback
    }

    const userId = session?.user?.id || bodyUserId || `user_${Math.random().toString(36).substring(2, 9)}`;
    const userName = session?.user?.name || bodyUserName || 'Cinema Friend';
    const userEmail = session?.user?.email || bodyUserEmail || 'friend@flixora.com';

    const { db } = await connectToDatabase();

    const group = await db.collection('group_bookings').findOne({
      $or: [{ groupCode }, { groupCode: groupCode.toUpperCase() }],
    });

    if (!group) {
      return NextResponse.json({ success: false, message: 'Group session not found' }, { status: 404 });
    }

    // Register / update member in group_members
    await db.collection('group_members').updateOne(
      { groupCode: group.groupCode, userId },
      {
        $set: {
          groupCode: group.groupCode,
          userId,
          userName,
          userEmail,
          paymentStatus: 'pending',
          isLeader: group.leaderUserId === userId,
          joinedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    const members = await db
      .collection('group_members')
      .find({ groupCode: group.groupCode })
      .toArray();

    return NextResponse.json({
      success: true,
      message: 'Joined group booking room successfully',
      group,
      members,
      currentUser: { userId, userName, userEmail },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
