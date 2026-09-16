import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdminAuth } from '@/lib/server-auth';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdminAuth();
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    // 1. Try Express backend
    try {
      const query = searchParams.toString();
      const backendRes = await fetch(`${SERVER_URL}/api/contact/messages?${query}`, {
        cache: 'no-store',
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
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { subject: { $regex: search.trim(), $options: 'i' } },
        { message: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const messages = await db
      .collection('contactmessages')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = messages.map((msg: any) => ({
      ...msg,
      _id: msg._id.toString(),
      createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching admin contact messages:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching contact messages.' },
      { status: 500 }
    );
  }
}
