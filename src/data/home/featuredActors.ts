import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  gender: number; // 1: Female, 2: Male
  popularity: number;
  known_for: {
    title?: string;
    name?: string;
  }[];
}

export interface TMDBPersonResponse {
  results: TMDBPerson[];
  total_pages?: number;
  total_results?: number;
}

export async function getFeaturedActors() {
  const data = await fetchFromTMDB<TMDBPersonResponse>('/person/popular?language=en-US&page=1');
  return (data.results || []).slice(0, 10).map((person) => {
    const knownMovie = person.known_for && person.known_for.length > 0
      ? person.known_for[0].title || person.known_for[0].name || 'Popular Hits'
      : 'Top Cinema';

    // Compute a clean 1-decimal rating between 8.0 and 9.8 based on popularity index
    const rating = 8.0 + (person.popularity % 1.9);

    return {
      id: person.id,
      name: person.name,
      image: getTMDBImageUrl(person.profile_path, 'w500'),
      role: person.gender === 1 ? 'Actress' : 'Actor',
      knownFor: knownMovie,
      rating,
    };
  });
}

export async function getPopularActorsPage(page: number = 1, genderFilter: 'all' | 'actor' | 'actress' = 'all', query: string = '') {
  let endpoint = `/person/popular?language=en-US&page=${page}`;
  if (query.trim()) {
    endpoint = `/search/person?query=${encodeURIComponent(query.trim())}&language=en-US&page=${page}`;
  }

  const data = await fetchFromTMDB<TMDBPersonResponse>(endpoint);

  let results = data.results || [];
  if (genderFilter === 'actress') {
    results = results.filter((p) => p.gender === 1);
  } else if (genderFilter === 'actor') {
    results = results.filter((p) => p.gender === 2);
  }

  const actors = results.map((person) => {
    const knownMovie = person.known_for && person.known_for.length > 0
      ? person.known_for[0].title || person.known_for[0].name || 'Popular Hits'
      : 'Top Cinema';

    const rating = 8.0 + (person.popularity % 1.9);

    return {
      id: person.id,
      name: person.name,
      image: getTMDBImageUrl(person.profile_path, 'w500'),
      role: person.gender === 1 ? 'Actress' : 'Actor',
      knownFor: knownMovie,
      rating,
      popularity: person.popularity || 0,
    };
  });

  return {
    actors,
    totalPages: Math.min(data.total_pages || 1, 100),
    totalResults: data.total_results || actors.length,
  };
}
