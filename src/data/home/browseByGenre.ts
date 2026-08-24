import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';
import { TMDBResponse, formatDuration } from './newReleases';

export interface GenreRowData {
  title: string;
  subtitle: string;
  movies: {
    id: number;
    title: string;
    image: string;
    rating: string;
  }[];
}

async function fetchGenreMovies(genreId: number): Promise<GenreRowData['movies']> {
  const data = await fetchFromTMDB<TMDBResponse>(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`
  );
  return data.results.slice(0, 12).map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: getTMDBImageUrl(movie.poster_path, 'w500'),
    rating: movie.vote_average > 0 ? movie.vote_average.toFixed(1) : '8.0',
  }));
}

export async function getBrowseByGenre(): Promise<GenreRowData[]> {
  const [actionMovies, scifiMovies, dramaMovies] = await Promise.all([
    fetchGenreMovies(28),  // Action
    fetchGenreMovies(878), // Sci-Fi
    fetchGenreMovies(18),  // Drama
  ]);

  return [
    {
      title: 'Action',
      subtitle: 'Adrenaline-fueled stories',
      movies: actionMovies,
    },
    {
      title: 'Sci-Fi',
      subtitle: 'Beyond the impossible',
      movies: scifiMovies,
    },
    {
      title: 'Drama',
      subtitle: 'Stories that stay with you',
      movies: dramaMovies,
    },
  ];
}
