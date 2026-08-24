import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';
import { getGenreName } from './newReleases';

export interface TMDBTrendingMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  vote_count: number;
  overview?: string;
}

export interface TMDBTrendingResponse {
  results: TMDBTrendingMovie[];
}

export async function getTrendingNow() {
  const data = await fetchFromTMDB<TMDBTrendingResponse>('/trending/movie/day?language=en-US');
  return data.results.slice(0, 10).map((movie, index) => {
    // Generate view count string from vote count
    let views = '1.2M';
    if (movie.vote_count) {
      if (movie.vote_count > 1000) {
        views = (movie.vote_count / 1000).toFixed(1) + 'M';
      } else {
        views = (movie.vote_count / 100).toFixed(1) + 'M'; // Scale slightly to look like millions
      }
    }

    return {
      id: movie.id,
      rank: index + 1,
      title: movie.title,
      image: getTMDBImageUrl(movie.poster_path, 'w500'),
      category: getGenreName(movie.genre_ids),
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026,
      views,
    };
  });
}
