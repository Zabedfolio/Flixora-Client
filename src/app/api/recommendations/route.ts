import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';
import { getGenreName, formatDuration } from '@/data/home/newReleases';

const GENRE_NAME_TO_ID: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  anime: 16,
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
  scifi: 878,
  'sci-fi': 878,
  'science fiction': 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

export async function GET() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = authSession?.user?.id;

    if (userId) {
      const { db } = await connectToDatabase();

      // 1. Fetch user's history, saved list, and playlists
      const [historyItems, listItems, playlistItems] = await Promise.all([
        db.collection('history').find({ userId }).sort({ watchedDate: -1 }).limit(20).toArray(),
        db.collection('Lists').find({ userId }).sort({ createdAt: -1 }).limit(20).toArray(),
        db.collection('playlist').find({ $or: [{ userId }, { userIds: userId }] }).limit(10).toArray(),
      ]);

      const excludedIds = new Set<string>();
      const excludedTitles = new Set<string>();
      const seedTmdbIds: number[] = [];
      const genreCounts: Record<number, number> = {};

      let lastInteractedTitle = '';

      // Helper to process movie records
      const processRecord = (rec: any) => {
        if (rec.movieId) excludedIds.add(String(rec.movieId).toLowerCase());
        if (rec.rawId) excludedIds.add(String(rec.rawId).toLowerCase());
        if (rec.tmdbId) {
          excludedIds.add(String(rec.tmdbId));
          const numId = Number(rec.tmdbId);
          if (!isNaN(numId) && !seedTmdbIds.includes(numId)) {
            seedTmdbIds.push(numId);
          }
        }
        if (rec.id && !isNaN(Number(rec.id))) {
          excludedIds.add(String(rec.id));
          const numId = Number(rec.id);
          if (!seedTmdbIds.includes(numId)) seedTmdbIds.push(numId);
        }
        if (rec.title) {
          excludedTitles.add(rec.title.toLowerCase().trim());
          if (!lastInteractedTitle) lastInteractedTitle = rec.title;
        }

        // Collect genre IDs
        if (Array.isArray(rec.genreIds)) {
          rec.genreIds.forEach((gid: any) => {
            const nGid = Number(gid);
            if (!isNaN(nGid) && nGid > 0) {
              genreCounts[nGid] = (genreCounts[nGid] || 0) + 2;
            }
          });
        }
        if (rec.category) {
          const catKey = String(rec.category).toLowerCase().replace(/[^a-z0-9]/g, '');
          const mappedGid = GENRE_NAME_TO_ID[catKey];
          if (mappedGid) {
            genreCounts[mappedGid] = (genreCounts[mappedGid] || 0) + 3;
          }
        }
        if (Array.isArray(rec.genres)) {
          rec.genres.forEach((gName: any) => {
            const gKey = String(gName).toLowerCase().replace(/[^a-z0-9]/g, '');
            const mappedGid = GENRE_NAME_TO_ID[gKey];
            if (mappedGid) {
              genreCounts[mappedGid] = (genreCounts[mappedGid] || 0) + 2;
            }
          });
        }
      };

      historyItems.forEach(processRecord);
      listItems.forEach(processRecord);

      // Process items inside user playlists
      playlistItems.forEach((pl: any) => {
        if (Array.isArray(pl.items)) {
          pl.items.forEach((item: any) => {
            processRecord(item);
          });
        }
      });

      const hasUserData = seedTmdbIds.length > 0 || Object.keys(genreCounts).length > 0;

      if (hasUserData) {
        // Sort genres by weight
        const topGenreIds = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([gid]) => Number(gid));

        const primaryGenreId = topGenreIds[0] || 28;
        const primaryGenreName = getGenreName([primaryGenreId]);

        // Candidates collection
        let candidateMovies: any[] = [];

        // 2A. Fetch TMDB similarity/recommendations for recent seed movie IDs
        for (const seedId of seedTmdbIds.slice(0, 3)) {
          try {
            const recData = await fetchFromTMDB<{ results: any[] }>(`/movie/${seedId}/recommendations?language=en-US&page=1`);
            if (recData?.results && recData.results.length > 0) {
              candidateMovies.push(...recData.results);
            } else {
              const simData = await fetchFromTMDB<{ results: any[] }>(`/movie/${seedId}/similar?language=en-US&page=1`);
              if (simData?.results) candidateMovies.push(...simData.results);
            }
          } catch (e) {
            // ignore TMDB fetch error for individual seed
          }
        }

        // 2B. Fetch TMDB discover by top user genre tags
        try {
          const discoverData = await fetchFromTMDB<{ results: any[] }>(
            `/discover/movie?with_genres=${topGenreIds.slice(0, 2).join(',')}&sort_by=popularity.desc&language=en-US&page=1`
          );
          if (discoverData?.results) {
            candidateMovies.push(...discoverData.results);
          }
        } catch (e) {
          // ignore
        }

        // 3. Strict Exclusion Filter (Remove exact movies user clicked or saved!)
        const seenIds = new Set<number>();
        const filteredMovies = candidateMovies.filter((movie) => {
          if (!movie || !movie.id || !movie.title) return false;
          if (seenIds.has(movie.id)) return false;
          seenIds.add(movie.id);

          const strId = String(movie.id);
          const strTitle = movie.title.toLowerCase().trim();

          // Exclude exact watched/saved IDs & titles
          if (excludedIds.has(strId) || excludedTitles.has(strTitle)) {
            return false;
          }

          return true;
        });

        if (filteredMovies.length >= 4) {
          const first = filteredMovies[0];
          const topPickReason = lastInteractedTitle
            ? `Based on your interest in "${lastInteractedTitle}"`
            : `Curated for your ${primaryGenreName} taste`;

          const topPick = {
            id: first.id,
            title: first.title,
            image: getTMDBImageUrl(first.poster_path, 'w500'),
            matchPercentage: 96 + (first.id % 4),
            category: getGenreName(first.genre_ids),
            reason: topPickReason,
            description: first.overview || "Recommended based on your recent viewing and saved list preferences.",
            duration: formatDuration(first.id),
            year: first.release_date ? new Date(first.release_date).getFullYear() : 2026,
          };

          const secondaryPicks = filteredMovies.slice(1, 10).map((movie, index) => ({
            id: movie.id,
            title: movie.title,
            image: getTMDBImageUrl(movie.poster_path, 'w500'),
            reasonTag: `${92 + ((movie.id + index) % 7)}% Match`,
            category: getGenreName(movie.genre_ids),
            rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 8.2,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026,
          }));

          return NextResponse.json({
            success: true,
            personalized: true,
            topPick,
            secondaryPicks,
          });
        }
      }
    }

    // Fallback for Guests or Users with no history
    const fallbackData = await fetchFromTMDB<{ results: any[] }>('/movie/popular?language=en-US&page=2');
    const results = fallbackData?.results || [];

    if (results.length > 0) {
      const first = results[0];
      const topPick = {
        title: first.title,
        image: getTMDBImageUrl(first.poster_path, 'w500'),
        matchPercentage: 95 + (first.id % 5),
        category: getGenreName(first.genre_ids),
        reason: "Top Pick for you this week",
        description: first.overview || "A special cinematic selection curated based on global blockbusters.",
        duration: formatDuration(first.id),
        year: first.release_date ? new Date(first.release_date).getFullYear() : 2026,
      };

      const secondaryPicks = results.slice(1, 10).map((movie) => ({
        id: movie.id,
        title: movie.title,
        image: getTMDBImageUrl(movie.poster_path, 'w500'),
        reasonTag: `${90 + (movie.id % 10)}% Match`,
        category: getGenreName(movie.genre_ids),
        rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 8.0,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2026,
      }));

      return NextResponse.json({
        success: true,
        personalized: false,
        topPick,
        secondaryPicks,
      });
    }

    return NextResponse.json({ success: false, message: 'Failed to generate recommendations' }, { status: 500 });
  } catch (error: any) {
    console.error('GET /api/recommendations error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
