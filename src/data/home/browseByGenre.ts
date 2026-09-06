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

async function fetchAnimeMovies(): Promise<GenreRowData['movies']> {
  try {
    const data = await fetchFromTMDB<TMDBResponse>(
      `/discover/movie?with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=300&language=en-US&page=1`
    );
    if (data.results && data.results.length > 0) {
      return data.results.slice(0, 12).map((movie) => ({
        id: movie.id,
        title: movie.title,
        image: getTMDBImageUrl(movie.poster_path, 'w500'),
        rating: movie.vote_average > 0 ? movie.vote_average.toFixed(1) : '8.5',
      }));
    }
  } catch (e) {}
  return fetchGenreMovies(16); // Fallback to animation genre
}

export async function getBrowseByGenre(): Promise<GenreRowData[]> {
  const [animeMovies, actionMovies, scifiMovies, dramaMovies] = await Promise.all([
    fetchAnimeMovies(),    // Anime Movies (Top-Rated Studio Ghibli & Feature Films)
    fetchGenreMovies(28),  // Action
    fetchGenreMovies(878), // Sci-Fi
    fetchGenreMovies(18),  // Drama
  ]);

  return [
    {
      title: 'Anime',
      subtitle: 'Critically acclaimed Studio Ghibli & anime feature films',
      movies: animeMovies,
    },
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
