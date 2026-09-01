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
    headers: await headers()
  });

  if (!authSession?.user?.id) {
    redirect('/auth/login');
  }
  
  let movieData: any;
  let creditsData: any;
  let videosData: any;

  try {
    movieData = await fetchFromTMDB<any>(`/movie/${id}?language=en-US`);
    if (!movieData || !movieData.title) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching movie details from TMDB:", error);
    notFound();
  }

  try {
    creditsData = await fetchFromTMDB<any>(`/movie/${id}/credits?language=en-US`);
  } catch (error) {
    console.error("Error fetching movie credits from TMDB:", error);
  }

  try {
    videosData = await fetchFromTMDB<any>(`/movie/${id}/videos?language=en-US`);
  } catch (error) {
    console.error("Error fetching movie videos from TMDB:", error);
  }

  const movie = {
    title: movieData.title,
    tagline: movieData.tagline || "",
    poster: getTMDBImageUrl(movieData.poster_path, 'w500'),
    backdrop: getTMDBImageUrl(movieData.backdrop_path, 'original'),
    rating: movieData.vote_average ? parseFloat(movieData.vote_average.toFixed(1)) : 0.0,
    releaseDate: movieData.release_date ? movieData.release_date.slice(0, 4) : "N/A",
    runtime: movieData.runtime ? `${movieData.runtime} min` : "N/A",
    genres: movieData.genres ? movieData.genres.map((g: any) => g.name) : [],
    overview: movieData.overview || "No overview available.",
  };

  // 2. Record Watch History in MongoDB
  try {
    const { db } = await connectToDatabase();
    await db.collection("history").updateOne(
      { userId: authSession.user.id, movieId: id },
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

  // Robustly filter to find official trailer
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
      id={id}
      movie={movie}
      movieData={movieData}
      cast={cast}
      trailerEmbedUrl={trailerEmbedUrl}
    />
  );
}