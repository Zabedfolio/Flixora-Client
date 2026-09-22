import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupCode: string }> }
) {
  try {
    const { groupCode } = await params;

    if (!groupCode) {
      return NextResponse.json({ success: false, message: 'Group code required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const group = await db.collection('group_bookings').findOne({
      $or: [{ groupCode }, { groupCode: groupCode.toUpperCase() }],
    });

    if (!group) {
      return NextResponse.json({ success: false, message: 'Group booking session not found' }, { status: 404 });
    }

    const members = await db
      .collection('group_members')
      .find({ groupCode: group.groupCode })
      .sort({ joinedAt: 1 })
      .toArray();

    // Clean up expired group locks
    await db.collection('seat_locks').deleteMany({ expiresAt: { $lte: new Date() } });

    // Fetch active seat locks for this group
    const activeGroupLocks = await db
      .collection('seat_locks')
      .find({ groupCode: group.groupCode, expiresAt: { $gt: new Date() } })
      .toArray();

    const groupHeldSeats = activeGroupLocks.map((l: any) => l.seatId);

    return NextResponse.json({
      success: true,
      group: {
        ...group,
        groupHeldSeats,
      },
      members: members.map((m: any) => ({
        userId: m.userId,
        userName: m.userName,
        userEmail: m.userEmail,
        selectedSeats: m.selectedSeats || [],
        paidSeats: m.paidSeats || [],
        paymentStatus: m.paymentStatus || 'pending',
        paidAt: m.paidAt || null,
        ticketId: m.ticketId || null,
        payerName: m.payerName || m.userName,
        isLeader: !!m.isLeader,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
