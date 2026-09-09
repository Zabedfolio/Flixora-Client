import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

// POST: Toggle block/unblock a movie for all Kids Profiles of the logged-in parent
export async function POST(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. You must be signed in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { movieId, movieTitle, action, kidsProfileId } = body;

    if (!movieId) {
      return NextResponse.json(
        { success: false, message: 'movieId is required' },
        { status: 400 }
      );
    }

    const strMovieId = String(movieId);
    const cleanTitle = (movieTitle && typeof movieTitle === 'string' && movieTitle.trim())
      ? movieTitle.trim()
      : 'Untitled Movie';
    const isUnblock = action === 'unblock';

    const { db } = await connectToDatabase();
    const userId = authSession.user.id;

    // Check if parent has any Kids Profiles
    const kidsProfiles = await db
      .collection('kids_profiles')
      .find({ parentId: userId })
      .toArray();

    if (kidsProfiles.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No Kids Profiles found. Create a Kids Profile first.' },
        { status: 404 }
      );
    }

    let query: any = { parentId: userId };
    if (kidsProfileId) {
      if (ObjectId.isValid(kidsProfileId)) {
        query._id = new ObjectId(kidsProfileId);
      } else {
        query._id = kidsProfileId;
      }
    }

    const cleanSlug = strMovieId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const lowerTitle = cleanTitle.toLowerCase();

    if (isUnblock) {
      // Pull from arrays
      await db.collection('kids_profiles').updateMany(query, {
        $pull: {
          blockedMovieIds: { $in: [strMovieId, cleanSlug] },
          blockedMovieTitles: { $in: [cleanTitle, lowerTitle] },
        } as any,
        $set: { updatedAt: new Date() },
      });
    } else {
      // Add to set (avoid duplicates)
      await db.collection('kids_profiles').updateMany(query, {
        $addToSet: {
          blockedMovieIds: { $each: [strMovieId, cleanSlug] },
          blockedMovieTitles: { $each: [cleanTitle, lowerTitle] },
        } as any,
        $set: { updatedAt: new Date() },
      });
    }

    // Return updated status
    const updatedProfiles = await db
      .collection('kids_profiles')
      .find({ parentId: userId })
      .toArray();

    const isBlocked = updatedProfiles.some((p: any) =>
      Array.isArray(p.blockedMovieIds) && p.blockedMovieIds.includes(strMovieId)
    );

    return NextResponse.json({
      success: true,
      isBlocked,
      message: isUnblock
        ? `"${cleanTitle}" has been unblocked for Kids Mode.`
        : `"${cleanTitle}" has been blocked for Kids Mode.`,
    });
  } catch (error: any) {
    console.error('POST /api/kids/block-movie error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update content restriction' },
      { status: 500 }
    );
  }
}
