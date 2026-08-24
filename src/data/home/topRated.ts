import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';
import { getGenreName } from './newReleases';
import { TMDBTrendingMovie, TMDBTrendingResponse } from './trendingNow';

export async function getTopRated() {
  const data = await fetchFromTMDB<TMDBTrendingResponse>('/movie/top_rated?language=en-US&page=1');
  return data.results.slice(0, 10).map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: getTMDBImageUrl(movie.poster_path, 'w500'),
    category: getGenreName(movie.genre_ids),
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026,
    rating: movie.vote_average,
    certified: movie.vote_average >= 8.3,
  }));
}
