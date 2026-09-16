import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // 1. Try Express backend
    try {
      const backendRes = await fetch(`${SERVER_URL}/api/contact/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to direct MongoDB
    }

    // 2. Direct MongoDB fallback
    const { db } = await connectToDatabase();
    const result = await db.collection('contactmessages').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ success: false, message: 'Message not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Message status updated successfully.',
      data: { ...result, _id: result._id.toString() },
    });
  } catch (err: any) {
    console.error('Error updating contact message status:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error updating message status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Try Express backend
    try {
      const backendRes = await fetch(`${SERVER_URL}/api/contact/messages/${id}`, {
        method: 'DELETE',
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to direct MongoDB
    }

    // 2. Direct MongoDB fallback
    const { db } = await connectToDatabase();
    const result = await db.collection('contactmessages').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Message not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (err: any) {
    console.error('Error deleting contact message:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error deleting message.' },
      { status: 500 }
    );
  }
}
