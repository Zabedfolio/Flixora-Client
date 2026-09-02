import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function DELETE(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;
    const userEmail = authSession.user.email;

    let password = '';
    try {
      const body = await req.json();
      password = body.password || '';
    } catch (e) {
      // body empty
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Account password is required to authorize deletion.' },
        { status: 400 }
      );
    }

    // Verify password via Better Auth API
    try {
      await auth.api.signInEmail({
        body: {
          email: userEmail,
          password: password,
        },
      });
    } catch (authErr: any) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Account deletion unauthorized.' },
        { status: 400 }
      );
    }

    // Purge user data across all database collections
    const { db } = await connectToDatabase();

    // Convert string userId to ObjectId for collections using ObjectId
    let userObjId: ObjectId | null = null;
    try {
      userObjId = new ObjectId(userId);
    } catch (e) {
      // Not an ObjectId string
    }

    const userIdFilter = userObjId
      ? { $or: [{ userId: userId }, { userId: userObjId }] }
      : { userId: userId };

    const _idFilter = userObjId
      ? { $or: [{ _id: userId }, { _id: userObjId }] }
      : { _id: userId };

    await Promise.all([
      db.collection('user').deleteMany(_idFilter),
      db.collection('account').deleteMany(userIdFilter),
      db.collection('session').deleteMany(userIdFilter),
      db.collection('profiles').deleteMany(userIdFilter),
      db.collection('Lists').deleteMany({ userId: userId }),
      db.collection('playlist').deleteMany({ userId: userId }),
      db.collection('history').deleteMany({ userId: userId }),
      db.collection('review').deleteMany({ userId: userId }),
      db.collection('payments').deleteMany({ userId: userId }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (error: any) {
    console.error('DELETE /api/user/delete-account error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete account.' },
      { status: 500 }
    );
  }
}
