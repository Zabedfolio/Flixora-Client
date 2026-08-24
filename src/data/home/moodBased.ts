import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';
import { getGenreName } from './newReleases';
import { TMDBTrendingMovie, TMDBTrendingResponse } from './trendingNow';
import { MoodId } from '@/components/home/ModeBasedSection';

export interface MoviePick {
  id: number;
  title: string;
  image: string;
  category: string;
  year: number;
  rating: number;
  matchScore: number;
  blurb: string;
  moods: MoodId[];
  energy: 'relaxed' | 'balanced' | 'high';
}

const mapMoodsAndEnergy = (genreIds: number[]): { moods: MoodId[]; energy: MoviePick['energy'] } => {
  const moods: MoodId[] = [];
  let energy: MoviePick['energy'] = 'balanced';

  // Map genres to moods
  if (genreIds.includes(35) || genreIds.includes(10751)) {
    moods.push('feel-good');
    energy = 'balanced';
  }
  if (genreIds.includes(53) || genreIds.includes(9648)) {
    moods.push('thrilling');
    energy = 'high';
  }
  if (genreIds.includes(10749)) {
    moods.push('romantic');
    energy = 'relaxed';
  }
  if (genreIds.includes(16) || genreIds.includes(14) || genreIds.includes(10402)) {
    moods.push('chill');
    energy = 'relaxed';
  }
  if (genreIds.includes(27) || genreIds.includes(80)) {
    moods.push('dark');
    energy = 'high';
  }
  if (genreIds.includes(878) || genreIds.includes(9648)) {
    moods.push('mind-bending');
    energy = 'balanced';
  }
  if (genreIds.includes(28) || genreIds.includes(12)) {
    moods.push('adrenaline');
    energy = 'high';
  }

  // Fallback if no specific mood was added
  if (moods.length === 0) {
    moods.push('feel-good');
  }

  return { moods, energy };
};

export async function getMoodBasedPicks(): Promise<MoviePick[]> {
  // Fetch popular movies to distribute among moods
  const [page1, page2] = await Promise.all([
    fetchFromTMDB<TMDBTrendingResponse>('/movie/popular?language=en-US&page=1'),
    fetchFromTMDB<TMDBTrendingResponse>('/movie/popular?language=en-US&page=2')
  ]);

  const allMovies = [...page1.results, ...page2.results];

  return allMovies.map((movie) => {
    const { moods, energy } = mapMoodsAndEnergy(movie.genre_ids);
    // Generate realistic match score and blurb
    const matchScore = 80 + (movie.id % 20);
    const blurb = movie.overview && movie.overview.length > 120 
      ? movie.overview.slice(0, 117) + '...' 
      : movie.overview || 'A captivating journey filled with unexpected turns, deep character moments, and beautiful cinematography.';

    return {
      id: movie.id,
      title: movie.title,
      image: getTMDBImageUrl(movie.poster_path, 'w500'),
      category: getGenreName(movie.genre_ids),
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026,
      rating: movie.vote_average,
      matchScore,
      blurb,
      moods,
      energy,
    };
  });
}
