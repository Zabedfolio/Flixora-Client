import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';

export interface TMDBTrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  vote_count: number;
}

export interface TMDBTrendingResponse {
  results: TMDBTrendingItem[];
  total_pages: number;
  total_results: number;
}

export async function getTrendingMovies(
  timeRange: 'today' | 'week',
  category: 'all' | 'movie' | 'tv' | 'anime',
  page: number = 1
) {
  const range = timeRange === 'today' ? 'day' : 'week';
  let endpoint = `/trending/movie/${range}?language=en-US&page=${page}`;

  if (category === 'tv') {
    endpoint = `/trending/tv/${range}?language=en-US&page=${page}`;
  } else if (category === 'all') {
    endpoint = `/trending/all/${range}?language=en-US&page=${page}`;
  } else if (category === 'anime') {
    // TMDB genre 16 is Animation. To get anime-like content we discover Animation with original language Japanese (ja)
    endpoint = `/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&language=en-US&page=${page}`;
  }

  const data = await fetchFromTMDB<TMDBTrendingResponse>(endpoint);

  const movies = data.results.map((item) => {
    const isRising = item.vote_count > 500 && item.vote_average >= 7.5;
    const title = item.title || item.name || 'Trending Title';
    const releaseDate = item.release_date || item.first_air_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : '2026';
    
    // Genre mapping helper
    const genreMap: Record<number, string> = {
      28: 'Action', 12: 'Adventure', 16: 'Anime', 35: 'Comedy', 80: 'Crime',
      99: 'Doc', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
      878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };

    return {
      id: item.id,
      title,
      type: (item.title ? 'movie' : 'tv') as 'movie' | 'tv',
      vote_average: item.vote_average || 8.0,
      release_year: year,
      genres: item.genre_ids.map(id => genreMap[id] || '').filter(Boolean),
      is_rising: isRising,
      unsplash_url: getTMDBImageUrl(item.poster_path, 'w500'),
    };
  });

  return {
    movies,
    totalPages: Math.min(data.total_pages, 50),
    totalResults: data.total_results,
  };
}
