import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, category, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields: name, email, subject, and message.' },
        { status: 400 }
      );
    }

    // 1. Try Express backend
    try {
      const backendRes = await fetch(`${SERVER_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch {
      // Fallback to direct MongoDB
    }

    // 2. Direct MongoDB fallback
    const { db } = await connectToDatabase();
    const newDoc = {
      name,
      email: email.toLowerCase().trim(),
      subject,
      category: category || 'General Inquiry',
      message,
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('contactmessages').insertOne(newDoc);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! We will get back to you shortly.',
        data: { _id: result.insertedId.toString(), ...newDoc },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in /api/contact:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error submitting contact message.' },
      { status: 500 }
    );
  }
}
