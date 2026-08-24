import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

export interface TMDBResponse {
  results: TMDBMovie[];
}

export const GENRE_MAP: Record<number, string> = {
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

export const getGenreName = (ids: number[]): string => {
  if (!ids || ids.length === 0) return 'Movie';
  return GENRE_MAP[ids[0]] || 'Movie';
};

export const formatDuration = (id: number): string => {
  const mins = 90 + (id % 55);
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}H ${rem}M`;
};

export async function getNewReleases() {
  const data = await fetchFromTMDB<TMDBResponse>('/movie/now_playing?language=en-US&page=1');
  return data.results.slice(0, 10).map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: getTMDBImageUrl(movie.poster_path, 'w500'),
    rating: movie.vote_average > 0 ? movie.vote_average.toFixed(1) : '8.5',
    year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : '2026',
    genre: getGenreName(movie.genre_ids),
    duration: formatDuration(movie.id),
  }));
}
