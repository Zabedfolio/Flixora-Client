import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { getExploreMoviesFor12Page } from '@/data/explore/movies';

export async function GET(req: NextRequest) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const genre = searchParams.get('genre') || 'All';
    const maturity = searchParams.get('maturity') || 'All';
    const collection = searchParams.get('collection') || 'All';
    const featuredOnly = searchParams.get('featured') === 'true';
    const hiddenOnly = searchParams.get('hidden') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const { db } = await connectToDatabase();

    // Fetch custom catalogue overrides & custom movies stored in MongoDB
    const customItems = await db.collection('catalogue').find({}).toArray();
    const customCollections = await db.collection('playlists').find({}).toArray();

    const customMap: Record<string, any> = {};
    customItems.forEach((item: any) => {
      const key = item.movieId || item._id.toString();
      customMap[key] = item;
      if (item.title) customMap[item.title.toLowerCase()] = item;
    });

    // Fetch TMDB base feed dynamically for this specific 12-item page (on demand)
    const tmdbResult = await getExploreMoviesFor12Page(query, genre === 'All' ? 'All' : genre, page);

    // Merge TMDB feed with custom MongoDB overrides
    let mergedMovies = tmdbResult.movies.map((m) => {
      const override = customMap[m.id] || customMap[m.title.toLowerCase()] || {};
      return {
        id: m.id,
        title: override.title || m.title,
        type: (override.type || 'Movie') as 'Movie' | 'TV Series',
        rating: override.rating ?? m.rating,
        year: override.year ?? m.year,
        genres: override.genres || m.genres,
        posterUrl: override.posterUrl || m.posterUrl,
        backdropUrl: override.backdropUrl || m.posterUrl,
        streamUrl: override.streamUrl || '',
        trailerUrl: override.trailerUrl || '',
        synopsis: override.synopsis || `Stream and enjoy ${m.title} in HD quality on Flixora.`,
        maturityRating: override.maturityRating || (m.rating >= 8.5 ? 'PG-13' : 'R'),
        isFeaturedHero: !!override.isFeaturedHero,
        isHidden: !!override.isHidden,
        collections: override.collections || [],
        createdAt: override.createdAt || new Date().toISOString(),
      };
    });

    // On page 1, prepend newly added custom movies from DB that are not in TMDB feed
    if (page === 1) {
      const customNewMovies = customItems
        .filter((ci: any) => ci.isCustomNew)
        .map((ci: any) => ({
          id: ci._id.toString(),
          title: ci.title,
          type: ci.type || 'Movie',
          rating: ci.rating || 8.0,
          year: ci.year || 2026,
          genres: ci.genres || ['Action'],
          posterUrl: ci.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
          backdropUrl: ci.backdropUrl || ci.posterUrl,
          streamUrl: ci.streamUrl || '',
          trailerUrl: ci.trailerUrl || '',
          synopsis: ci.synopsis || '',
          maturityRating: ci.maturityRating || 'PG-13',
          isFeaturedHero: !!ci.isFeaturedHero,
          isHidden: !!ci.isHidden,
          collections: ci.collections || [],
          createdAt: ci.createdAt || new Date().toISOString(),
        }));

      mergedMovies = [...customNewMovies, ...mergedMovies].slice(0, 12);
    }

    // Apply client filters if maturity, collection, featured, or hidden filters are active
    if (maturity && maturity !== 'All') {
      mergedMovies = mergedMovies.filter((m) => m.maturityRating === maturity);
    }
    if (collection && collection !== 'All') {
      mergedMovies = mergedMovies.filter((m) => m.collections.includes(collection));
    }
    if (featuredOnly) {
      mergedMovies = mergedMovies.filter((m) => m.isFeaturedHero);
    }
    if (hiddenOnly) {
      mergedMovies = mergedMovies.filter((m) => m.isHidden);
    }

    const featuredHeroCount = customItems.filter((i: any) => i.isFeaturedHero).length;
    const hiddenCount = customItems.filter((i: any) => i.isHidden).length;
    const publishedCount = Math.max(0, tmdbResult.totalResults - hiddenCount);

    return NextResponse.json({
      success: true,
      result: {
        movies: mergedMovies,
        totalResults: tmdbResult.totalResults,
        totalPages: tmdbResult.totalPages,
        featuredHeroCount,
        hiddenCount,
        publishedCount,
      },
      collections: customCollections.map((c: any) => ({
        id: c._id.toString(),
        name: c.name || 'Untitled Collection',
        tag: c.tag || 'Curated',
        description: c.description || '',
        movieIds: c.movies ? c.movies.map((m: any) => m.movieId) : [],
        createdAt: c.createdAt || new Date().toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('GET /api/admin/catalogue error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}

// POST: Add new custom movie/show OR create new custom collection
export async function POST(req: NextRequest) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { db } = await connectToDatabase();

    if (body.action === 'create_collection') {
      const newCollection = {
        name: body.name || 'Custom Collection',
        tag: body.tag || 'Curated',
        description: body.description || '',
        movies: (body.movieIds || []).map((id: string) => ({ movieId: id })),
        createdBy: authSession.user.id,
        createdAt: new Date().toISOString(),
      };
      const res = await db.collection('playlists').insertOne(newCollection);
      return NextResponse.json({ success: true, collectionId: res.insertedId.toString() });
    }

    // Add new custom movie to catalogue
    const newMovie = {
      isCustomNew: true,
      title: body.title || 'Untitled Movie',
      type: body.type || 'Movie',
      rating: parseFloat(body.rating) || 8.5,
      year: parseInt(body.year) || 2026,
      genres: Array.isArray(body.genres) ? body.genres : (body.genres || 'Action').split(',').map((g: string) => g.trim()),
      posterUrl: body.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      backdropUrl: body.backdropUrl || body.posterUrl,
      streamUrl: body.streamUrl || '',
      trailerUrl: body.trailerUrl || '',
      synopsis: body.synopsis || '',
      maturityRating: body.maturityRating || 'PG-13',
      isFeaturedHero: !!body.isFeaturedHero,
      isHidden: !!body.isHidden,
      collections: body.collections || [],
      createdBy: authSession.user.id,
      createdAt: new Date().toISOString(),
    };

    const res = await db.collection('catalogue').insertOne(newMovie);
    return NextResponse.json({ success: true, movieId: res.insertedId.toString() });
  } catch (error: any) {
    console.error('POST /api/admin/catalogue error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Update item metadata, hero featured status, hidden status, maturity rating, or collection membership
export async function PUT(req: NextRequest) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { movieId, updates } = body;

    if (!movieId) {
      return NextResponse.json({ success: false, message: 'Movie ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const isMongoId = ObjectId.isValid(movieId);
    const filter = isMongoId ? { _id: new ObjectId(movieId) } : { movieId };

    await db.collection('catalogue').updateOne(
      filter,
      {
        $set: {
          movieId,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Metadata updated successfully' });
  } catch (error: any) {
    console.error('PUT /api/admin/catalogue error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Remove item from custom catalogue
export async function DELETE(req: NextRequest) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const isMongoId = ObjectId.isValid(id);

    if (isMongoId) {
      await db.collection('catalogue').deleteOne({ _id: new ObjectId(id) });
    } else {
      await db.collection('catalogue').deleteOne({ movieId: id });
    }

    return NextResponse.json({ success: true, message: 'Removed from catalogue' });
  } catch (error: any) {
    console.error('DELETE /api/admin/catalogue error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
