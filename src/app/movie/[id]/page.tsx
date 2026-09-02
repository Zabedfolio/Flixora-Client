import { fetchFromTMDB, getTMDBImageUrl } from "@/data/tmdb";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/(auth)/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import MovieDetailsView from "@/components/movie/MovieDetailsView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Authenticate User Server-Side
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authSession?.user?.id) {
    redirect('/auth/login');
  }

  let movieData: any = null;
  let creditsData: any = null;
  let videosData: any = null;
  let resolvedId = id;

  // Step A: Attempt direct TMDB ID lookup if numerical
  if (/^\d+$/.test(id)) {
    try {
      movieData = await fetchFromTMDB<any>(`/movie/${id}?language=en-US`);
    } catch (e) {
      // Failed numerical lookup
    }
  }

  // Step B: Search TMDB by slug/title query if direct fetch didn't return a movie
  if (!movieData || !movieData.title) {
    try {
      const cleanQuery = id.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
      if (cleanQuery) {
        const searchRes = await fetchFromTMDB<any>(
          `/search/movie?query=${encodeURIComponent(cleanQuery)}&language=en-US`
        );
        if (searchRes?.results && searchRes.results.length > 0) {
          const matched = searchRes.results[0];
          resolvedId = String(matched.id);
          movieData = await fetchFromTMDB<any>(`/movie/${resolvedId}?language=en-US`);
        }
      }
    } catch (e) {
      console.error("TMDB search fallback error:", e);
    }
  }

  // Step C: Database record lookup fallback (Lists, playlist, history)
  let dbItem: any = null;
  if (!movieData || !movieData.title) {
    try {
      const { db } = await connectToDatabase();
      const cleanKey = id.toLowerCase().replace(/[^a-z0-9]/g, '-');

      dbItem =
        (await db.collection('Lists').findOne({
          $or: [
            { movieId: id },
            { movieId: cleanKey },
            { title: { $regex: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') } },
          ],
        })) ||
        (await db.collection('history').findOne({
          $or: [{ movieId: id }, { movieId: cleanKey }],
        }));
    } catch (dbErr) {
      console.error("DB fallback lookup error:", dbErr);
    }
  }

  // If still no movieData from TMDB, construct fallback object from DB record or fail cleanly
  if (!movieData || !movieData.title) {
    if (dbItem) {
      const displayTitle = dbItem.title || id.replace(/-/g, ' ');
      movieData = {
        title: displayTitle,
        tagline: "Featured Collection Title",
        poster_path: null,
        backdrop_path: null,
        vote_average: 8.5,
        release_date: dbItem.year || "2026",
        runtime: parseInt(dbItem.duration) || 120,
        genres: [{ name: dbItem.category || 'Movie' }],
        overview: `Stream and enjoy ${displayTitle} on Flixora. High definition quality with crystal clear audio.`,
        customPoster: dbItem.unsplash_url || dbItem.poster,
        customBackdrop: dbItem.unsplash_url || dbItem.poster,
      };
    } else {
      notFound();
    }
  }

  // Fetch credits & videos if we have a valid resolved numerical TMDB ID
  if (/^\d+$/.test(resolvedId)) {
    try {
      creditsData = await fetchFromTMDB<any>(`/movie/${resolvedId}/credits?language=en-US`);
    } catch (error) {
      // silent
    }

    try {
      videosData = await fetchFromTMDB<any>(`/movie/${resolvedId}/videos?language=en-US`);
    } catch (error) {
      // silent
    }
  }

  const posterUrl = movieData.poster_path
    ? getTMDBImageUrl(movieData.poster_path, 'w500')
    : movieData.customPoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';

  const backdropUrl = movieData.backdrop_path
    ? getTMDBImageUrl(movieData.backdrop_path, 'original')
    : movieData.customBackdrop || posterUrl;

  const movie = {
    title: movieData.title,
    tagline: movieData.tagline || "",
    poster: posterUrl,
    backdrop: backdropUrl,
    rating: movieData.vote_average ? parseFloat(movieData.vote_average.toFixed(1)) : 8.5,
    releaseDate: movieData.release_date ? String(movieData.release_date).slice(0, 4) : "2026",
    runtime: movieData.runtime ? `${movieData.runtime} min` : "120 min",
    genres: movieData.genres ? movieData.genres.map((g: any) => g.name) : ["Movie"],
    overview: movieData.overview || "No overview available.",
  };

  // Record Watch History in MongoDB
  try {
    const { db } = await connectToDatabase();
    await db.collection("history").updateOne(
      { userId: authSession.user.id, movieId: resolvedId },
      { 
        $set: { 
          title: movie.title,
          poster: movie.poster,
          year: movie.releaseDate,
          duration: movie.runtime,
          category: movie.genres[0] || 'Movie',
          watchedDate: new Date()
        } 
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("Error recording watch history:", err);
  }

  const cast = creditsData?.cast?.slice(0, 6).map((c: any) => ({
    name: c.name,
    character: c.character,
    profile: c.profile_path ? getTMDBImageUrl(c.profile_path, 'w200') : null
  })) || [];

  const trailers = videosData?.results?.filter(
    (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
  );

  const trailer = trailers?.find(
    (v: any) => v.name.toLowerCase().includes('official trailer')
  ) || trailers?.[0] || videosData?.results?.find(
    (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip')
  );

  const trailerEmbedUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;

  return (
    <MovieDetailsView
      id={resolvedId}
      movie={movie}
      movieData={movieData}
      cast={cast}
      trailerEmbedUrl={trailerEmbedUrl}
    />
  );
}