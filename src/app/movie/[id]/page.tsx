import { fetchFromTMDB, getTMDBImageUrl } from "@/data/tmdb";
import { notFound, redirect } from "next/navigation";
import { Star, User } from "lucide-react";
import MovieActions from "@/components/movie/MovieActions";
import { auth } from "@/app/(auth)/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // -----------------------------------
  // 1. Authenticate User Server-Side
  // -----------------------------------
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

  // -----------------------------------
  // 2. Record Watch History in MongoDB
  // -----------------------------------
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

  // Robustly filter to find the official trailer, falling back to teaser or clip if needed
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
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[650px] pt-24 md:pt-32 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 md:opacity-100 animate-in fade-in duration-700"
          style={{
            backgroundImage: `url(${movie.backdrop})`,
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-end gap-8 px-6 pb-16 md:px-10">
          {/* Poster */}
          <div className="hidden w-56 shrink-0 overflow-hidden rounded-xl border border-[#FF4C00]/30 shadow-2xl md:block">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Movie Details */}
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#FF4C00]">
              Featured Movie
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-4 text-lg italic text-gray-300">
                "{movie.tagline}"
              </p>
            )}

            {/* Movie Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-300 font-bold">
              <span className="flex items-center gap-1.5 font-semibold text-[#FF4C00]">
                <Star size={16} fill="currentColor" /> {movie.rating}
              </span>

              <span>{movie.releaseDate}</span>

              <span>{movie.runtime}</span>
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="rounded-full border border-[#FF4C00]/40 bg-[#FF4C00]/10 px-3 py-1 text-xs text-[#FF8A5C] font-semibold"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="mt-5 max-w-xl leading-7 text-gray-300 font-medium">
              {movie.overview}
            </p>

            {/* Interactive Playlist & Watchlist buttons */}
            <MovieActions
              movie={{
                id: id,
                title: movie.title,
                unsplash_url: movie.poster,
                year: movie.releaseDate,
                duration: movie.runtime,
                category: movie.genres[0] || 'Movie'
              }}
            />
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="border-t border-white/10 bg-black px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
            
            {/* Overview & Production Details */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4C00]">
                  About the Movie
                </p>

                <h2 className="mb-5 text-3xl font-bold md:text-4xl">
                  Overview
                </h2>

                <p className="max-w-3xl text-base leading-8 text-gray-400 font-medium">
                  {movie.overview}
                </p>
              </div>

              {movieData.production_companies?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-white">Production Companies</h3>
                  <div className="flex flex-wrap gap-4">
                    {movieData.production_companies.map((company: any) => (
                      <div key={company.id} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-bold text-gray-300">
                        {company.logo_path && (
                          <img
                            src={getTMDBImageUrl(company.logo_path, 'w200')}
                            alt={company.name}
                            className="h-6 max-w-[80px] object-contain filter invert brightness-200 opacity-80"
                            loading="lazy"
                          />
                        )}
                        <span>{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movieData.production_countries?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-white">Production Countries</h3>
                  <p className="text-sm font-semibold text-gray-400">
                    {movieData.production_countries.map((c: any) => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Extended Movie Information */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 h-fit shadow-lg">
              <h3 className="mb-5 text-xl font-semibold">
                Movie Information
              </h3>

              <div className="space-y-4 text-sm font-semibold">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Rating</span>
                  <span className="flex items-center gap-1 font-medium text-[#FF4C00]">
                    <Star size={14} fill="currentColor" /> {movie.rating}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Status</span>
                  <span className="text-gray-200">
                    {movieData.status || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Release Date</span>
                  <span className="text-gray-200">
                    {movieData.release_date || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Runtime</span>
                  <span className="text-gray-200">
                    {movie.runtime}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Budget</span>
                  <span className="text-gray-200">
                    {movieData.budget > 0
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(movieData.budget)
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Revenue</span>
                  <span className="text-gray-200">
                    {movieData.revenue > 0
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(movieData.revenue)
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Language</span>
                  <span className="text-gray-200">
                    {movieData.original_language?.toUpperCase() || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Popularity</span>
                  <span className="text-gray-200">
                    {movieData.popularity ? movieData.popularity.toFixed(1) : 'N/A'}
                  </span>
                </div>

                {movieData.imdb_id && (
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-gray-500">IMDb Reference</span>
                    <a
                      href={`https://www.imdb.com/title/${movieData.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF4C00] hover:underline"
                    >
                      View on IMDb ↗
                    </a>
                  </div>
                )}

                <div>
                  <p className="mb-3 text-gray-500 font-semibold">Genres</p>

                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: string) => (
                      <span
                        key={genre}
                        className="rounded-full border border-[#FF4C00]/30 bg-[#FF4C00]/10 px-3 py-1 text-xs text-[#FF8A5C] font-semibold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trailer Section */}
      <section className="bg-black px-6 py-16 md:px-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4C00]">
              Watch
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Official Trailer
            </h2>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            {trailerEmbedUrl ? (
              <iframe
                className="h-full w-full rounded-2xl border-0"
                src={trailerEmbedUrl}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500 font-semibold uppercase tracking-wider bg-zinc-950">
                No official trailer available
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Cast & Crew Section */}
      <section className="bg-black px-6 py-16 md:px-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4C00]">
              Meet the Cast
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Cast & Crew
            </h2>
          </div>

          {/* Cast Cards */}
          {cast.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((actor: any, idx: number) => (
                <div key={idx} className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50 hover:shadow-[0_8px_24px_rgba(255,76,0,0.15)]">
                  <div className="aspect-[3/4] overflow-hidden bg-white/5 relative">
                    {actor.profile ? (
                      <img
                        src={actor.profile}
                        alt={actor.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-950">
                        <User size={36} className="text-zinc-650" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate">
                      {actor.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 truncate font-semibold">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-550 text-sm font-semibold">Cast details unavailable for this movie.</p>
          )}
        </div>
      </section>
    </main>
  );
}