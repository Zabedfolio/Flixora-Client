import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers()
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }

    const { role } = await request.json();
    if (!role) {
      return NextResponse.json({
        success: false,
        message: 'Missing role parameter'
      }, { status: 400 });
    }

    const allowedRoles = [
      'superman', 
      'spiderman', 
      'batman', 
      'ironman', 
      'thor', 
      'hulk', 
      'captainamerica', 
      'tom', 
      'jerry', 
      'user'
    ];
    
    // Security Guard: Prevent admin roles from being customized or lost here
    const currentDbRole = (authSession.user as any).role;
    if (currentDbRole === 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin account roles cannot be customized here'
      }, { status: 403 });
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid character role selection'
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Update the role in the user document
    await db.collection('user').updateOne(
      { _id: new ObjectId(authSession.user.id) },
      { $set: { role: role } }
    );

    return NextResponse.json({
      success: true,
      message: 'Character role updated successfully'
    });
  } catch (error: any) {
    console.error('POST /api/user/role error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
