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

    const lockSeats = activeGroupLocks.map((l: any) => l.seatId);
    const poolSeats = Array.isArray(group.groupSeatPool) ? group.groupSeatPool : [];
    const memberSelectedSeats = members.flatMap((m: any) => m.selectedSeats || []);

    // Combine all unique seats held/selected in this group session
    const rawGroupSeats = Array.from(new Set([...lockSeats, ...poolSeats, ...memberSelectedSeats]));

    // Find all seats already paid for in this group session
    const paidSeatsInGroup = new Set(
      members
        .filter((m: any) => m.paymentStatus === 'paid')
        .flatMap((m: any) => m.paidSeats || m.selectedSeats || [])
    );

    // Unpaid group seats ready for checkout
    const unpaidGroupSeats = rawGroupSeats.filter((seatId) => !paidSeatsInGroup.has(seatId));

    return NextResponse.json({
      success: true,
      group: {
        ...group,
        groupHeldSeats: unpaidGroupSeats,
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
