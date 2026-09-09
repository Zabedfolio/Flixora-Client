import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';

export interface AnimeItem {
  id: number;
  title: string;
  image: string;
  rating: number;
  category: string;
  year: number;
  certified: boolean;
}

interface TMDBAnimeResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

interface TMDBAnimeResponse {
  results: TMDBAnimeResult[];
}

export async function getPopularAnime(): Promise<AnimeItem[]> {
  try {
    // Fetch popular anime TV series specifically
    const tvData = await fetchFromTMDB<TMDBAnimeResponse>(
      '/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&language=en-US&page=1'
    ).catch(() => ({ results: [] }));

    const validAnime = (tvData.results || []).filter((item) => item.poster_path);

    if (validAnime.length > 0) {
      return validAnime.slice(0, 12).map((item) => {
        const title = item.name || item.title || 'Anime Series';
        const dateStr = item.first_air_date || item.release_date || '2026';
        const year = parseInt(dateStr.slice(0, 4)) || 2026;
        const rating = item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 8.5;

        return {
          id: item.id,
          title,
          image: getTMDBImageUrl(item.poster_path, 'w500'),
          category: 'Anime Series',
          year,
          rating,
          certified: rating >= 8.0,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching popular anime series:', error);
  }

  // Curated fallback popular anime series list if network fails
  return [
    {
      id: 1429,
      title: 'Attack on Titan',
      image: 'https://image.tmdb.org/t/p/w500/hTP12qAYEXsiHR4evWZiSHyAozA.jpg',
      category: 'Anime Series',
      year: 2013,
      rating: 9.0,
      certified: true,
    },
    {
      id: 85937,
      title: 'Demon Slayer: Kimetsu no Yaiba',
      image: 'https://image.tmdb.org/t/p/w500/xUfVStVxBOZ142xMKx96R1gU9uB.jpg',
      category: 'Anime Series',
      year: 2019,
      rating: 8.7,
      certified: true,
    },
    {
      id: 95479,
      title: 'Jujutsu Kaisen',
      image: 'https://image.tmdb.org/t/p/w500/eFiYc20d7K9z5Gf8Vb0sA7bWfG9.jpg',
      category: 'Anime Series',
      year: 2020,
      rating: 8.6,
      certified: true,
    },
    {
      id: 114410,
      title: 'Chainsaw Man',
      image: 'https://image.tmdb.org/t/p/w500/npdB6eFzLw3vW9X2m2y5nL7r4vS.jpg',
      category: 'Anime Series',
      year: 2022,
      rating: 8.5,
      certified: true,
    },
    {
      id: 30984,
      title: 'Bleach',
      image: 'https://image.tmdb.org/t/p/w500/v9l2c8a14z1b5p0e3W4V3n7u8Wp.jpg',
      category: 'Anime Series',
      year: 2004,
      rating: 8.4,
      certified: true,
    },
  ];
}
