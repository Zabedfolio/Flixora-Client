import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { getRandomPlaylistSuggestion } from '@/lib/playlistGenerator';
import { seedUserCuratedPlaylists } from '@/lib/curatedPlaylists';

// GET: Fetch user's playlists OR a single playlist by ID (publicly accessible for shareable links)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const { db } = await connectToDatabase();

    // 1. If an ID is provided, return that specific playlist (Shareable Link mode)
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: 'Invalid playlist ID' },
          { status: 400 }
        );
      }

      const playlist = await db
        .collection('playlist')
        .findOne({ _id: new ObjectId(id) });

      if (!playlist) {
        return NextResponse.json(
          { success: false, message: 'Playlist not found' },
          { status: 404 }
        );
      }

      // Dynamically resolve creator's current name from user collection
      let creatorName = 'Curator';
      if (playlist.userId) {
        try {
          const creator = await db.collection('user').findOne(
            { _id: new ObjectId(playlist.userId) },
            { projection: { name: 1 } }
          );
          if (creator?.name) {
            creatorName = creator.name;
          }
        } catch (e) {
          // ignore
        }
      }

      // Check session to determine if current user owns or has saved this playlist
      const authSession = await auth.api.getSession({
        headers: await headers(),
      });
      const currentUserId = authSession?.user?.id;
      const isOwner = Boolean(currentUserId && playlist.userId === currentUserId);
      const isSaved = Boolean(
        currentUserId &&
          (playlist.userId === currentUserId ||
            (Array.isArray(playlist.userIds) && playlist.userIds.includes(currentUserId)))
      );

      return NextResponse.json({
        success: true,
        playlist: {
          ...playlist,
          _id: playlist._id.toString(),
          userName: creatorName,
          isOwner,
          isSaved,
        },
      });
    }

    // 2. Otherwise, require authentication and fetch all playlists for current user
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Auto-connect pre-created curated playlists for new users
    try {
      const userDoc = await db.collection('user').findOne({
        _id: new ObjectId(authSession.user.id),
      });

      if (!userDoc?.playlistsInitialized) {
        await seedUserCuratedPlaylists(db, authSession.user.id);

        await db.collection('user').updateOne(
          { _id: new ObjectId(authSession.user.id) },
          { $set: { playlistsInitialized: true } }
        );
      }
    } catch (seedErr) {
      console.error('Auto-seed playlist error:', seedErr);
    }

    const playlists = await db
      .collection('playlist')
      .find({
        $or: [
          { userId: authSession.user.id },
          { userIds: authSession.user.id },
        ],
      })
      .sort({ isPreCreated: -1, createdAt: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      playlists: playlists.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      })),
    });
  } catch (error: any) {
    console.error('GET /api/playlist error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new playlist (custom or randomized)
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
    let { name, tag, description, initialMovie, isRandom } = body;

    // If random requested or name is empty, generate creative suggestion
    if (isRandom || !name?.trim()) {
      const suggestion = getRandomPlaylistSuggestion();
      name = name?.trim() || suggestion.name;
      tag = tag?.trim() || suggestion.tag;
    }

    const { db } = await connectToDatabase();

    const newPlaylistDoc: any = {
      userId: authSession.user.id,
      name: name.trim(),
      tag: (tag || 'Custom').trim(),
      description: (description || '').trim(),
      isPublic: true,
      movies: initialMovie
        ? [
            {
              movieId: String(initialMovie.movieId || initialMovie.id),
              title: initialMovie.title,
              unsplash_url:
                initialMovie.unsplash_url || initialMovie.poster || '',
              category: initialMovie.category || 'Movie',
              year: String(initialMovie.year || ''),
              duration: String(initialMovie.duration || ''),
              addedAt: new Date(),
            },
          ]
        : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('playlist').insertOne(newPlaylistDoc);

    return NextResponse.json({
      success: true,
      playlist: {
        ...newPlaylistDoc,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error: any) {
    console.error('POST /api/playlist error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Add or remove a movie from playlist, or update playlist details
export async function PUT(req: Request) {
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
    const { action, playlistId, movie, movieId, movieTitle, name, tag, description } = body;

    if (!playlistId || !ObjectId.isValid(playlistId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid playlist ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    if (action === 'saveToDashboard') {
      await db.collection('playlist').updateOne(
        { _id: new ObjectId(playlistId) },
        { $addToSet: { userIds: authSession.user.id } as any }
      );
      return NextResponse.json({
        success: true,
        message: 'Playlist added to your dashboard',
      });
    }

    if (action === 'removeFromDashboard') {
      await db.collection('playlist').updateOne(
        { _id: new ObjectId(playlistId) },
        { $pull: { userIds: authSession.user.id } as any }
      );
      return NextResponse.json({
        success: true,
        message: 'Playlist removed from your dashboard',
      });
    }

    const filter = {
      _id: new ObjectId(playlistId),
      $or: [
        { userId: authSession.user.id },
        { userIds: authSession.user.id },
      ],
    };

    const existingPlaylist = await db.collection('playlist').findOne(filter);
    if (!existingPlaylist) {
      return NextResponse.json(
        { success: false, message: 'Playlist not found or unauthorized' },
        { status: 404 }
      );
    }

    if (action === 'addMovie') {
      if (!movie || (!movie.id && !movie.movieId && !movie.title)) {
        return NextResponse.json(
          { success: false, message: 'Invalid movie data' },
          { status: 400 }
        );
      }

      const cleanMovieId = String(movie.movieId || movie.id);
      const cleanTitle = movie.title || '';

      // Check if already in playlist
      const alreadyExists = (existingPlaylist.movies || []).some(
        (m: any) =>
          String(m.movieId) === cleanMovieId ||
          m.title.toLowerCase() === cleanTitle.toLowerCase()
      );

      if (!alreadyExists) {
        const movieEntry = {
          movieId: cleanMovieId,
          title: cleanTitle,
          unsplash_url: movie.unsplash_url || movie.poster || '',
          category: movie.category || 'Movie',
          year: String(movie.year || ''),
          duration: String(movie.duration || ''),
          addedAt: new Date(),
        };

        await db.collection('playlist').updateOne(filter, {
          $push: { movies: movieEntry } as any,
          $set: { updatedAt: new Date() },
        });
      }

      const updated = await db.collection('playlist').findOne(filter);
      return NextResponse.json({
        success: true,
        message: 'Movie added to playlist',
        playlist: { ...updated, _id: updated?._id.toString() },
      });
    }

    if (action === 'removeMovie') {
      const cleanMovieId = movieId ? String(movieId) : null;
      const cleanTitle = movieTitle ? String(movieTitle).toLowerCase() : null;

      await db.collection('playlist').updateOne(filter, {
        $pull: {
          movies: {
            $or: [
              ...(cleanMovieId ? [{ movieId: cleanMovieId }] : []),
              ...(cleanTitle ? [{ title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') } }] : []),
            ],
          },
        } as any,
        $set: { updatedAt: new Date() },
      });

      const updated = await db.collection('playlist').findOne(filter);
      return NextResponse.json({
        success: true,
        message: 'Movie removed from playlist',
        playlist: { ...updated, _id: updated?._id.toString() },
      });
    }

    if (action === 'updateDetails') {
      await db.collection('playlist').updateOne(filter, {
        $set: {
          ...(name ? { name: name.trim() } : {}),
          ...(tag ? { tag: tag.trim() } : {}),
          ...(description !== undefined ? { description: description.trim() } : {}),
          updatedAt: new Date(),
        },
      });

      const updated = await db.collection('playlist').findOne(filter);
      return NextResponse.json({
        success: true,
        message: 'Playlist details updated',
        playlist: { ...updated, _id: updated?._id.toString() },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action provided' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('PUT /api/playlist error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a playlist owned by user
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid playlist ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const playlist = await db.collection('playlist').findOne({
      _id: new ObjectId(id),
      $or: [
        { userId: authSession.user.id },
        { userIds: authSession.user.id },
      ],
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, message: 'Playlist not found or unauthorized' },
        { status: 404 }
      );
    }

    // If pre-created / shared playlist: DO NOT DELETE DOCUMENT FROM DATABASE!
    // Only remove this specific user's ID from userIds array
    if (playlist.isPreCreated || Array.isArray(playlist.userIds)) {
      await db.collection('playlist').updateOne(
        { _id: new ObjectId(id) },
        {
          $pull: { userIds: authSession.user.id } as any,
          ...(playlist.userId === authSession.user.id ? { $unset: { userId: "" } } : {}),
        } as any
      );

      return NextResponse.json({
        success: true,
        message: 'Playlist removed for this user',
      });
    }

    // Otherwise personal custom playlist: delete the document
    const result = await db.collection('playlist').deleteOne({
      _id: new ObjectId(id),
      userId: authSession.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Playlist not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Playlist deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE /api/playlist error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
