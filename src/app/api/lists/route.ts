import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

// GET: Fetch all items in My List for the authenticated user
export async function GET() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const items = await db
      .collection('Lists')
      .find({ userId: authSession.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      items: items.map((item: any) => ({
        _id: item._id.toString(),
        id: item.movieId,
        movieId: item.movieId,
        title: item.title,
        year: item.year || '',
        duration: item.duration || '',
        category: item.category || 'Movie',
        unsplash_url: item.unsplash_url || '',
        createdAt: item.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/lists error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add a movie to My List for the authenticated user
export async function POST(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { movieId, id, title, year, duration, category, unsplash_url } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    const cleanMovieId = String(movieId || id || title).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const { db } = await connectToDatabase();
    const now = new Date();

    const filter = {
      userId: authSession.user.id,
      movieId: cleanMovieId,
    };

    const updateDoc = {
      $set: {
        userId: authSession.user.id,
        movieId: cleanMovieId,
        title: title.trim(),
        year: String(year || ''),
        duration: String(duration || ''),
        category: String(category || 'Movie'),
        unsplash_url: String(unsplash_url || ''),
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    };

    await db.collection('Lists').updateOne(filter, updateDoc, { upsert: true });
    const saved = await db.collection('Lists').findOne(filter);

    return NextResponse.json({
      success: true,
      message: 'Added to My List',
      item: {
        _id: saved?._id.toString(),
        id: saved?.movieId,
        movieId: saved?.movieId,
        title: saved?.title,
        year: saved?.year,
        duration: saved?.duration,
        category: saved?.category,
        unsplash_url: saved?.unsplash_url,
      },
    });
  } catch (error: any) {
    console.error('POST /api/lists error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a movie from My List for the authenticated user
export async function DELETE(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let movieId: string | null = null;
    let title: string | null = null;

    try {
      const body = await req.json();
      movieId = body.movieId || body.id || null;
      title = body.title || null;
    } catch (e) {
      const { searchParams } = new URL(req.url);
      movieId = searchParams.get('movieId') || searchParams.get('id');
      title = searchParams.get('title');
    }

    if (!movieId && !title) {
      return NextResponse.json(
        { success: false, message: 'movieId or title is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const cleanMovieId = movieId ? String(movieId).toLowerCase().replace(/[^a-z0-9]/g, '-') : null;

    const deleteFilter: any = {
      userId: authSession.user.id,
      $or: [
        ...(cleanMovieId ? [{ movieId: cleanMovieId }] : []),
        ...(title ? [{ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } }] : []),
      ],
    };

    await db.collection('Lists').deleteMany(deleteFilter);

    return NextResponse.json({
      success: true,
      message: 'Removed from My List',
    });
  } catch (error: any) {
    console.error('DELETE /api/lists error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
