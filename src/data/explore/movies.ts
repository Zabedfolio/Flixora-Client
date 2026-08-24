import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';
import { TMDBTrendingMovie } from '../home/trendingNow';

export interface TMDBResponse {
  results: TMDBTrendingMovie[];
  total_pages: number;
  total_results: number;
}

const EXPLORE_GENRE_MAP: Record<string, number> = {
  'Action': 28,
  'Sci-Fi': 878,
  'Cyberpunk': 878, // Map Cyberpunk to Sci-Fi since TMDB does not have a separate ID
  'Drama': 18,
  'Thriller': 53,
  'Horror': 27,
  'Anime': 16,     // Map Anime to Animation genre
  'Mystery': 9648,
  'Comedy': 35,
  'Adventure': 12,
  'Fantasy': 14,
};

export async function getExploreMovies(query: string, genre: string, page: number = 1) {
  let endpoint = `/movie/popular?language=en-US&page=${page}`;

  if (query) {
    endpoint = `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
  } else if (genre && genre !== 'All') {
    const genreId = EXPLORE_GENRE_MAP[genre];
    if (genreId) {
      endpoint = `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=${page}`;
    }
  }

  const data = await fetchFromTMDB<TMDBResponse>(endpoint);

  const movies = data.results.map((movie) => {
    const matchScore = 80 + (movie.id % 20);
    return {
      id: movie.id.toString(),
      title: movie.title,
      rating: movie.vote_average || 8.0,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026,
      duration: '2h 10m', // default runtime
      matchScore,
      genres: movie.genre_ids.map(id => {
        // Quick local lookup for genres
        const genreMap: Record<number, string> = {
          28: 'Action', 12: 'Adventure', 16: 'Anime', 35: 'Comedy', 80: 'Crime',
          99: 'Doc', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
          27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
          878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western'
        };
        return genreMap[id] || '';
      }).filter(Boolean),
      moods: [],
      posterUrl: getTMDBImageUrl(movie.poster_path, 'w500'),
      isAiRecommended: matchScore >= 95,
    };
  });

  return {
    movies,
    totalPages: Math.min(data.total_pages, 100), // Cap pages to avoid loading deep pagination
    totalResults: data.total_results,
  };
}
