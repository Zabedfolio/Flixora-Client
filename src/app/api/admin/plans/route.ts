import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Live: https://flixora-server.vercel.app
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/plans`, { cache: 'no-store' });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline; query MongoDB directly
  }

  // 2. Direct MongoDB fallback
  try {
    const { db } = await connectToDatabase();
    const plans = await db.collection('plans').find({}).toArray();

    const formatted = plans.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/plans`, {
      method: 'POST',
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
    const doc = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('plans').insertOne(doc);
    return NextResponse.json({
      success: true,
      message: 'Plan created successfully',
      data: { ...doc, _id: result.insertedId.toString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create plan' },
      { status: 500 }
    );
  }
}
