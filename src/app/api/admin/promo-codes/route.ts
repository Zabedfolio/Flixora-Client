import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'https://flixora-server.vercel.app';

export async function GET() {
  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/promo-codes`, { cache: 'no-store' });
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
    let codes = await db.collection('promo_codes').find({}).sort({ createdAt: -1 }).toArray();

    // Auto-seed if empty
    if (codes.length === 0) {
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + 3);

      const defaultCodes = [
        {
          code: 'FLIX25',
          discountPercentage: 25,
          expirationDate: expDate,
          usageLimit: 250,
          usedCount: 42,
          isActive: true,
          createdAt: new Date(),
        },
        {
          code: 'WELCOME50',
          discountPercentage: 50,
          expirationDate: expDate,
          usageLimit: 100,
          usedCount: 18,
          isActive: true,
          createdAt: new Date(),
        },
        {
          code: 'STREAM10',
          discountPercentage: 10,
          expirationDate: expDate,
          usageLimit: 500,
          usedCount: 110,
          isActive: true,
          createdAt: new Date(),
        },
      ];
      await db.collection('promo_codes').insertMany(defaultCodes);
      codes = await db.collection('promo_codes').find({}).sort({ createdAt: -1 }).toArray();
    }

    const formatted = codes.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      expirationDate: c.expirationDate ? new Date(c.expirationDate).toISOString().split('T')[0] : '',
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch promo codes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // 1. Try Express backend first
  try {
    const backendRes = await fetch(`${SERVER_URL}/api/promo-codes`, {
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
    const formattedCode = (body.code || '').trim().toUpperCase();

    const existing = await db.collection('promo_codes').findOne({ code: formattedCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Promo code '${formattedCode}' already exists` },
        { status: 400 }
      );
    }

    const doc = {
      code: formattedCode,
      discountPercentage: Number(body.discountPercentage),
      expirationDate: new Date(body.expirationDate),
      usageLimit: Number(body.usageLimit),
      usedCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('promo_codes').insertOne(doc);

    return NextResponse.json({
      success: true,
      message: 'Promo code created successfully',
      data: {
        ...doc,
        _id: result.insertedId.toString(),
        expirationDate: doc.expirationDate.toISOString().split('T')[0],
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create promo code' },
      { status: 500 }
    );
  }
}
