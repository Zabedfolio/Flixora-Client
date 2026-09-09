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
  blockedMovieTitles: string[];

  // Actions
  enterKidsMode: (profile: KidsProfile) => void;
  exitKidsMode: (enteredPin: string) => boolean;
  setActiveKidsProfile: (profile: KidsProfile | null) => void;
  updateBlockedContent: (blockedMovieIds: string[], blockedGenres: string[], blockedMovieTitles?: string[]) => void;
  isMovieBlocked: (
    movieId?: string | number,
    arg2?: string | string[],
    arg3?: string | string[]
  ) => boolean;
  syncActiveProfile: () => Promise<void>;
}

export const useKidsStore = create<KidsStore>()(
  persist(
    (set, get) => ({
      isKidsMode: false,
      activeKidsProfile: null,
      blockedMovieIds: [],
      blockedGenres: [],
      blockedMovieTitles: [],

      enterKidsMode: (profile: KidsProfile) => {
        set({
          isKidsMode: true,
          activeKidsProfile: profile,
          blockedMovieIds: profile.blockedMovieIds || [],
          blockedGenres: profile.blockedGenres || [],
          blockedMovieTitles: profile.blockedMovieTitles || [],
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
            blockedMovieTitles: [],
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
            blockedMovieTitles: [],
          });
        } else {
          set({
            isKidsMode: true,
            activeKidsProfile: profile,
            blockedMovieIds: profile.blockedMovieIds || [],
            blockedGenres: profile.blockedGenres || [],
            blockedMovieTitles: profile.blockedMovieTitles || [],
          });
        }
      },

      updateBlockedContent: (blockedMovieIds: string[], blockedGenres: string[], blockedMovieTitles: string[] = []) => {
        const currentProfile = get().activeKidsProfile;
        if (currentProfile) {
          set({
            activeKidsProfile: {
              ...currentProfile,
              blockedMovieIds,
              blockedGenres,
              blockedMovieTitles,
            },
            blockedMovieIds,
            blockedGenres,
            blockedMovieTitles,
          });
        } else {
          set({
            blockedMovieIds,
            blockedGenres,
            blockedMovieTitles,
          });
        }
      },

      isMovieBlocked: (
        movieId?: string | number,
        arg2?: string | string[],
        arg3?: string | string[]
      ) => {
        const { isKidsMode, activeKidsProfile, blockedMovieIds, blockedGenres, blockedMovieTitles } = get();
        if (!isKidsMode) return false;

        const rawBlockedTitles = activeKidsProfile?.blockedMovieTitles || blockedMovieTitles || [];
        const rawBlockedIds = activeKidsProfile?.blockedMovieIds || blockedMovieIds || [];
        const rawBlockedGenres = activeKidsProfile?.blockedGenres || blockedGenres || [];

        let titleStr = '';
        let genresArr: string[] = [];

        if (typeof arg2 === 'string') {
          titleStr = arg2;
        } else if (Array.isArray(arg2)) {
          genresArr = arg2;
        }

        if (typeof arg3 === 'string') {
          if (!titleStr) titleStr = arg3;
          else genresArr.push(arg3);
        } else if (Array.isArray(arg3)) {
          genresArr = [...genresArr, ...arg3];
        }

        const strId = movieId !== undefined && movieId !== null ? String(movieId).trim().toLowerCase() : '';
        const strTitle = titleStr.trim().toLowerCase();

        // 1. Check ID match
        if (
          strId &&
          rawBlockedIds.some(
            (bId) =>
              String(bId).trim().toLowerCase() === strId ||
              String(bId).trim().toLowerCase().replace(/[^a-z0-9]/g, '') === strId.replace(/[^a-z0-9]/g, '')
          )
        ) {
          return true;
        }

        // 2. Check Title match
        if (strTitle) {
          const formatTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
          const formattedInputTitle = formatTitle(strTitle);
          if (
            rawBlockedTitles.some(bTitle => {
              const b = String(bTitle).trim().toLowerCase();
              if (!b) return false;
              const formattedB = formatTitle(b);
              return (
                b === strTitle ||
                formattedB === formattedInputTitle ||
                (formattedInputTitle.length > 3 && (formattedInputTitle.includes(formattedB) || formattedB.includes(formattedInputTitle)))
              );
            })
          ) {
            return true;
          }
        }

        // 3. Check All Movies / All Anime
        const isAnimeMovie = genresArr.some(g => g.toLowerCase() === 'anime' || g.toLowerCase() === 'animation');
        if (rawBlockedGenres.includes('all_movies') && !isAnimeMovie) return true;
        if (rawBlockedGenres.includes('all_anime') && isAnimeMovie) return true;

        // 4. Check Genre match
        if (genresArr.length > 0) {
          const lowerGenres = genresArr.map(g => g.toLowerCase());
          if (
            rawBlockedGenres.some(bGenre => {
              const bg = bGenre.toLowerCase();
              return lowerGenres.some(lg => lg === bg || lg.includes(bg) || bg.includes(lg));
            })
          ) {
            return true;
          }
        }

        return false;
      },

      syncActiveProfile: async () => {
        const { isKidsMode, activeKidsProfile } = get();
        if (!isKidsMode) return;

        try {
          const res = await fetch('/api/kids');
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.profiles) && data.profiles.length > 0) {
              const fresh = activeKidsProfile?._id || activeKidsProfile?.id
                ? data.profiles.find(
                    (p: KidsProfile) =>
                      p._id === activeKidsProfile._id ||
                      p.id === activeKidsProfile._id ||
                      p._id === activeKidsProfile.id ||
                      p.id === activeKidsProfile.id
                  ) || data.profiles[0]
                : data.profiles[0];

              if (fresh) {
                set({
                  activeKidsProfile: fresh,
                  blockedMovieIds: fresh.blockedMovieIds || [],
                  blockedGenres: fresh.blockedGenres || [],
                  blockedMovieTitles: fresh.blockedMovieTitles || [],
                });
              }
            }
          }
        } catch (err) {
          console.error('Failed to sync active kids profile:', err);
        }
      },
    }),
    {
      name: 'flixora_kids_store',
    }
  )
);
