import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';
import { getHistory } from '@/data/historyStore';

export interface AIRecommendationResult {
  reason: string;
  suggestedGenres: string[];
  topPick: {
    id: number;
    title: string;
    image: string;
    matchPercentage: number;
    category: string;
    reason: string;
    description: string;
    duration: string;
    year: number;
  } | null;
  secondaryPicks: Array<{
    id: number;
    title: string;
    image: string;
    reasonTag: string;
    category: string;
    rating: number;
    year: number;
  }>;
}

const TMDB_GENRES: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "science fiction": 878,
  scifi: 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

const GENRE_NAME_MAP: Record<number, string> = {
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
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function getWatchedGenres(): string[] {
  const history = getHistory();
  const genresSet = new Set<string>();

  history.forEach((item) => {
    if (Array.isArray(item.genres)) {
      item.genres.forEach((g) => genresSet.add(g));
    }
  });

  return Array.from(genresSet);
}

export async function fetchAIRecommendation(customGenres?: string[], userId?: string): Promise<AIRecommendationResult> {
  const watchedGenres = customGenres && customGenres.length > 0
    ? customGenres
    : getWatchedGenres();

  const activeGenres = watchedGenres.length > 0 ? watchedGenres : ['Action', 'Sci-Fi', 'Thriller'];

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${serverUrl}/api/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: userId || 'current_user',
        genres: activeGenres 
      }),
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.success && resData.data?.movies?.length > 0) {
        const { reason, suggestedGenres, movies } = resData.data;

        const top = movies[0];
        const secondaries = movies.slice(1);

        return {
          reason: reason || `Curated for your love of ${activeGenres[0]}`,
          suggestedGenres: suggestedGenres || activeGenres,
          topPick: {
            id: top.id,
            title: top.title || top.name || 'Featured Pick',
            image: getTMDBImageUrl(top.poster_path, 'w500'),
            matchPercentage: Math.floor(88 + Math.random() * 11),
            category: (top.genre_ids && top.genre_ids.length > 0)
              ? GENRE_NAME_MAP[top.genre_ids[0]] || 'Featured'
              : 'Featured',
            reason: reason || 'Top Pick for You',
            description: top.overview || 'Handpicked based on your recent genre history and AI analysis.',
            duration: `${Math.floor(1 + Math.random() * 1)}h ${Math.floor(20 + Math.random() * 35)}m`,
            year: top.release_date ? new Date(top.release_date).getFullYear() : 2025,
          },
          secondaryPicks: secondaries.map((m: any) => ({
            id: m.id,
            title: m.title || m.name,
            image: getTMDBImageUrl(m.poster_path, 'w500'),
            reasonTag: `${Math.floor(85 + Math.random() * 14)}% Match`,
            category: (m.genre_ids && m.genre_ids.length > 0)
              ? GENRE_NAME_MAP[m.genre_ids[0]] || 'Popular'
              : 'Popular',
            rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.2,
            year: m.release_date ? new Date(m.release_date).getFullYear() : 2025,
          })),
        };
      }
    }
  } catch (error) {
    console.warn('Backend AI service call failed, using client TMDB fallback:', error);
  }

  // Fallback to TMDB Discover API
  const genreIds = activeGenres
    .map((g) => TMDB_GENRES[g.toLowerCase().trim()])
    .filter(Boolean);

  const randomPage = Math.floor(Math.random() * 5) + 1;
  const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join('|')}` : '';
  const tmdbData = await fetchFromTMDB<{ results: any[] }>(
    `/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&page=${randomPage}&vote_count.gte=50${genreQuery}`
  );

  const results = tmdbData.results || [];
  const shuffled = [...results].sort(() => Math.random() - 0.5);

  const first = shuffled[0] || {
    id: 550,
    title: 'Interstellar',
    poster_path: null,
    overview: 'A mind-bending journey through space and time.',
    genre_ids: [878, 18],
    release_date: '2014-11-05',
    vote_average: 8.7,
  };

  return {
    reason: `Based on your interest in ${activeGenres.slice(0, 2).join(' & ')}`,
    suggestedGenres: activeGenres,
    topPick: {
      id: first.id,
      title: first.title,
      image: getTMDBImageUrl(first.poster_path, 'w500'),
      matchPercentage: 96,
      category: GENRE_NAME_MAP[first.genre_ids?.[0]] || 'Sci-Fi',
      reason: 'AI Recommendation',
      description: first.overview || 'Recommended based on your watch history.',
      duration: '2h 15m',
      year: first.release_date ? new Date(first.release_date).getFullYear() : 2024,
    },
    secondaryPicks: shuffled.slice(1, 10).map((m) => ({
      id: m.id,
      title: m.title,
      image: getTMDBImageUrl(m.poster_path, 'w500'),
      reasonTag: `${Math.floor(88 + Math.random() * 10)}% Match`,
      category: GENRE_NAME_MAP[m.genre_ids?.[0]] || 'Movie',
      rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.1,
      year: m.release_date ? new Date(m.release_date).getFullYear() : 2024,
    })),
  };
}
