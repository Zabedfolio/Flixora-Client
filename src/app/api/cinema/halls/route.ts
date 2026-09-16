import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CINEMA_HALLS_DATA } from '@/data/cinemaData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const district = searchParams.get('district') || '';
    const titleId = searchParams.get('titleId') || '';

    let halls: any[] = [];

    try {
      const { db } = await connectToDatabase();
      const dbHalls = await db.collection('cinema_halls').find({}).toArray();
      if (Array.isArray(dbHalls) && dbHalls.length > 0) {
        halls = dbHalls;
      }
    } catch {
      // fallback
    }

    if (halls.length === 0) {
      halls = CINEMA_HALLS_DATA;
    }

    if (district) {
      halls = halls.filter((h) => (h.district || '').toLowerCase() === district.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      halls,
      district,
      titleId,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
