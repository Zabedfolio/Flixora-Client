import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Live: https://flixora-server.vercel.app
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline; handle in MongoDB directly
  }

  // 2. Direct MongoDB fallback
  try {
    const { db } = await connectToDatabase();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id };

    await db.collection('plans').updateOne(query, {
      $set: {
        ...body,
        updatedAt: new Date(),
      },
    });

    const updated = await db.collection('plans').findOne(query);

    return NextResponse.json({
      success: true,
      message: 'Plan updated successfully',
      data: { ...updated, _id: updated?._id.toString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/plans/${id}`, {
      method: 'DELETE',
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline; handle in MongoDB directly
  }

  // 2. Direct MongoDB fallback
  try {
    const { db } = await connectToDatabase();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id };

    await db.collection('plans').deleteOne(query);

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete plan' },
      { status: 500 }
    );
  }
}
