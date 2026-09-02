import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

// GET: Fetch reviews for a specific movie OR all public reviews if no movieId is provided
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movieId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const { db } = await connectToDatabase();
    const query = movieId ? { movieId: String(movieId) } : {};

    const reviews = await db
      .collection('review')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (
              reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0) /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    return NextResponse.json({
      success: true,
      reviews: reviews.map((r: any) => ({
        _id: r._id.toString(),
        movieId: r.movieId,
        movieTitle: r.movieTitle || 'Featured Film',
        userId: r.userId,
        userName: r.userName || 'Anonymous Viewer',
        username: `@${(r.userName || 'viewer').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        userEmail: r.userEmail || '',
        userAvatar: r.userAvatar || '',
        rating: Number(r.rating) || 5,
        review: r.review || '',
        createdAt: r.createdAt,
      })),
      stats: {
        totalReviews,
        averageRating,
      },
    });
  } catch (error: any) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Submit or update a user review for a movie
export async function POST(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'You must be signed in to submit a review' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { movieId, movieTitle, rating, review } = body;

    if (!movieId) {
      return NextResponse.json(
        { success: false, message: 'movieId is required' },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    if (!review || typeof review !== 'string' || review.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'Review content must be at least 3 characters long' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const now = new Date();

    // Look up latest user name and image from user collection if available
    let currentUserName = authSession.user.name || 'Verified Viewer';
    let currentUserAvatar = authSession.user.image || '';

    try {
      const { ObjectId } = require('mongodb');
      const userDoc = await db.collection('user').findOne(
        { _id: new ObjectId(authSession.user.id) },
        { projection: { name: 1, image: 1 } }
      );
      if (userDoc?.name) currentUserName = userDoc.name;
      if (userDoc?.image) currentUserAvatar = userDoc.image;
    } catch (e) {
      // Fallback to session values
    }

    const filter = {
      movieId: String(movieId),
      userId: authSession.user.id,
    };

    const cleanTitle = (movieTitle && typeof movieTitle === 'string' && movieTitle.trim())
      ? movieTitle.trim()
      : 'Featured Movie';

    const updateDoc = {
      $set: {
        movieId: String(movieId),
        movieTitle: cleanTitle,
        userId: authSession.user.id,
        userName: currentUserName,
        userEmail: authSession.user.email || '',
        userAvatar: currentUserAvatar,
        rating: Math.round(numRating),
        review: review.trim(),
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    };

    await db.collection('review').updateOne(filter, updateDoc, { upsert: true });

    const saved = await db.collection('review').findOne(filter);

    return NextResponse.json({
      success: true,
      message: 'Your review has been published!',
      review: {
        ...saved,
        _id: saved?._id.toString(),
      },
    });
  } catch (error: any) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
