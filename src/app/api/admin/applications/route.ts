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
    const department = searchParams.get('department') || '';

    // 1. Try Express backend first
    try {
      const query = searchParams.toString();
      const backendRes = await fetch(`${SERVER_URL}/api/careers/applications?${query}`, {
        cache: 'no-store',
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fall through to MongoDB direct fallback
    }

    // 2. Direct MongoDB fallback
    const { db } = await connectToDatabase();
    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (department && department !== 'all') {
      filter.department = department;
    }

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { jobTitle: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const applications = await db
      .collection('jobapplications')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = applications.map((app: any) => ({
      ...app,
      _id: app._id.toString(),
      createdAt: app.createdAt ? new Date(app.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching admin job applications:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error fetching applications.' },
      { status: 500 }
    );
  }
}
