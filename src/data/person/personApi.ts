import { fetchFromTMDB, getTMDBImageUrl } from '../tmdb';

export interface TMDBPersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number; // 1: Female, 2: Male
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  known_for_department: string;
  imdb_id: string | null;
  homepage: string | null;
}

export interface TMDBPersonProfileImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
}

export interface TMDBPersonImagesResponse {
  id: number;
  profiles: TMDBPersonProfileImage[];
}

export interface TMDBPersonCreditItem {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  character?: string;
  job?: string;
  popularity: number;
  overview?: string;
}

export interface TMDBPersonCreditsResponse {
  id: number;
  cast: TMDBPersonCreditItem[];
  crew: TMDBPersonCreditItem[];
}

export interface PersonFullData {
  person: TMDBPersonDetails;
  photos: string[];
  credits: {
    id: string;
    title: string;
    mediaType: 'movie' | 'tv';
    posterUrl: string;
    rating: number;
    year: number;
    character: string;
    popularity: number;
  }[];
}

export async function getPersonFullData(personId: string | number): Promise<PersonFullData | null> {
  try {
    const [person, imagesRes, creditsRes] = await Promise.all([
      fetchFromTMDB<TMDBPersonDetails>(`/person/${personId}?language=en-US`),
      fetchFromTMDB<TMDBPersonImagesResponse>(`/person/${personId}/images`).catch(() => ({ id: Number(personId), profiles: [] })),
      fetchFromTMDB<TMDBPersonCreditsResponse>(`/person/${personId}/combined_credits?language=en-US`).catch(() => ({ id: Number(personId), cast: [], crew: [] })),
    ]);

    if (!person || !person.id) return null;

    // Photos gallery (multiple high-res images)
    const photos = (imagesRes.profiles || []).map((img) => getTMDBImageUrl(img.file_path, 'original'));

    // Fallback if profile photos list is empty
    if (photos.length === 0 && person.profile_path) {
      photos.push(getTMDBImageUrl(person.profile_path, 'original'));
    }

    // Credits / Filmography
    const rawCast = creditsRes.cast || [];
    // Sort by popularity desc
    const sortedCast = [...rawCast].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    // Deduplicate by ID
    const seenIds = new Set<string>();
    const credits = sortedCast
      .map((item) => {
        const title = item.title || item.name || 'Untitled Project';
        const dateStr = item.release_date || item.first_air_date || '';
        const year = dateStr ? new Date(dateStr).getFullYear() : 2026;
        const id = item.id.toString();

        if (seenIds.has(id)) return null;
        seenIds.add(id);

        return {
          id,
          title,
          mediaType: (item.media_type || 'movie') as 'movie' | 'tv',
          posterUrl: getTMDBImageUrl(item.poster_path, 'w500'),
          rating: item.vote_average || 8.0,
          year,
          character: item.character || 'Cast',
          popularity: item.popularity || 0,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      person,
      photos,
      credits,
    };
  } catch (error) {
    console.error(`Error fetching person data for ${personId}:`, error);
    return null;
  }
}
