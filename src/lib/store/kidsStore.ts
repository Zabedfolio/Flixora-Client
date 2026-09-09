import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KidsProfile {
  _id: string;
  id?: string;
  parentId: string;
  name: string;
  username: string;
  pin: string;
  avatar: string;
  blockedGenres: string[];
  blockedMovieIds: string[];
  blockedMovieTitles: string[];
  createdAt?: string;
}

interface KidsStore {
  isKidsMode: boolean;
  activeKidsProfile: KidsProfile | null;
  blockedMovieIds: string[];
  blockedGenres: string[];

  // Actions
  enterKidsMode: (profile: KidsProfile) => void;
  exitKidsMode: (enteredPin: string) => boolean;
  setActiveKidsProfile: (profile: KidsProfile | null) => void;
  updateBlockedContent: (blockedMovieIds: string[], blockedGenres: string[]) => void;
  isMovieBlocked: (movieId: string | number, genres?: string[]) => boolean;
}

export const useKidsStore = create<KidsStore>()(
  persist(
    (set, get) => ({
      isKidsMode: false,
      activeKidsProfile: null,
      blockedMovieIds: [],
      blockedGenres: [],

      enterKidsMode: (profile: KidsProfile) => {
        set({
          isKidsMode: true,
          activeKidsProfile: profile,
          blockedMovieIds: profile.blockedMovieIds || [],
          blockedGenres: profile.blockedGenres || [],
        });
      },

      exitKidsMode: (enteredPin: string) => {
        const currentProfile = get().activeKidsProfile;
        if (!currentProfile || String(currentProfile.pin).trim() === String(enteredPin).trim()) {
          set({
            isKidsMode: false,
            activeKidsProfile: null,
            blockedMovieIds: [],
            blockedGenres: [],
          });
          return true;
        }
        return false;
      },

      setActiveKidsProfile: (profile: KidsProfile | null) => {
        if (!profile) {
          set({
            isKidsMode: false,
            activeKidsProfile: null,
            blockedMovieIds: [],
            blockedGenres: [],
          });
        } else {
          set({
            isKidsMode: true,
            activeKidsProfile: profile,
            blockedMovieIds: profile.blockedMovieIds || [],
            blockedGenres: profile.blockedGenres || [],
          });
        }
      },

      updateBlockedContent: (blockedMovieIds: string[], blockedGenres: string[]) => {
        set({
          blockedMovieIds,
          blockedGenres,
        });
      },

      isMovieBlocked: (movieId: string | number, genres: string[] = []) => {
        const { isKidsMode, blockedMovieIds, blockedGenres } = get();
        if (!isKidsMode) return false;

        const strId = String(movieId);
        if (blockedMovieIds.includes(strId)) return true;

        // Check if all movies or all anime are blocked
        if (blockedGenres.includes('all_movies') && !genres.includes('Anime')) return true;
        if (blockedGenres.includes('all_anime') && (genres.includes('Anime') || genres.includes('Animation'))) return true;

        // Check matching genre
        if (genres && genres.length > 0) {
          const isGenreBlocked = genres.some((g) =>
            blockedGenres.some((bg) => bg.toLowerCase() === g.toLowerCase())
          );
          if (isGenreBlocked) return true;
        }

        return false;
      },
    }),
    {
      name: 'flixora_kids_store',
    }
  )
);
