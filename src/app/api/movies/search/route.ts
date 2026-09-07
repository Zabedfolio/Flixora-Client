import { NextResponse } from 'next/server';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';

// GENRE ID MAP FOR TMDB MOVIES
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        movies: [],
      });
    }

    const cleanQuery = query.trim();

    // Query TMDB search endpoint
    const tmdbData = await fetchFromTMDB<any>(
      `/search/movie?query=${encodeURIComponent(cleanQuery)}&include_adult=false&language=en-US&page=1`
    );

    const rawResults = tmdbData?.results || [];

    // Filter and map normalized results
    const normalizedMovies = rawResults
      .slice(0, 10) // Get top 10 items to ensure minimum 5 rich suggestions
      .map((item: any) => {
        const releaseYear = item.release_date
          ? String(item.release_date).slice(0, 4)
          : '2024';

        const primaryGenreId = item.genre_ids && item.genre_ids[0];
        const categoryName = primaryGenreId ? GENRE_MAP[primaryGenreId] || 'Movie' : 'Movie';

        const posterUrl = item.poster_path
          ? getTMDBImageUrl(item.poster_path, 'w500')
          : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';

        const rating = item.vote_average
          ? parseFloat(Number(item.vote_average).toFixed(1))
          : 7.5;

        return {
          id: String(item.id),
          _id: String(item.id),
          title: item.title || item.original_title || 'Untitled Film',
          poster: posterUrl,
          unsplash_url: posterUrl,
          rating: rating.toFixed(1),
          year: releaseYear,
          category: categoryName,
          overview: item.overview ? String(item.overview).slice(0, 120) + '...' : '',
        };
      });

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      total: normalizedMovies.length,
      movies: normalizedMovies,
    });
  } catch (error: any) {
    console.error('GET /api/movies/search error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to search movies', movies: [] },
      { status: 500 }
    );
  }
}
