import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
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

    const { db } = await connectToDatabase();

    // Query watch history for active user, sorted by most recently watched
    const history = await db.collection('history')
      .find({ userId: authSession.user.id })
      .sort({ watchedDate: -1 })
      .toArray();

    // Format fields for frontend compatibility
    const formattedHistory = history.map((h: any) => ({
      id: h._id.toString(),
      movieId: h.movieId,
      title: h.title,
      type: 'movie',
      genres: h.category ? [h.category] : ['Movie'],
      unsplash_url: h.poster || '',
      watchedDate: h.watchedDate ? new Date(h.watchedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      hoursWatched: 2
    }));

    return NextResponse.json({
      success: true,
      data: formattedHistory
    });
  } catch (error: any) {
    console.error('GET /api/history error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch history'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { db } = await connectToDatabase();

    if (id) {
      // Delete specific history entry
      const deleteResult = await db.collection('history').deleteOne({
        _id: new ObjectId(id),
        userId: authSession.user.id
      });

      if (deleteResult.deletedCount === 0) {
        return NextResponse.json({
          success: false,
          message: 'History item not found or unauthorized'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Removed history item'
      });
    } else {
      // Clear entire watch history
      await db.collection('history').deleteMany({
        userId: authSession.user.id
      });

      return NextResponse.json({
        success: true,
        message: 'History cleared'
      });
    }
  } catch (error: any) {
    console.error('DELETE /api/history error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to clear history'
    }, { status: 500 });
  }
}
