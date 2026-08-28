const movie = {
  title: "Spider-Man: Brand New Day",
  tagline: "A brand new day starts now.",
  poster:
    "https://image.tmdb.org/t/p/w500/8p1D4cY9JfM4Y8hQ4v6F7H8K9L0.jpg",
  backdrop:
    "https://image.tmdb.org/t/p/original/8p1D4cY9JfM4Y8hQ4v6F7H8K9L0.jpg",
  rating: 7.9,
  releaseDate: "2026",
  runtime: "145 min",
  genres: ["Action", "Adventure", "Science Fiction"],
  overview:
    "Peter Parker returns for a new adventure as Spider-Man. A new threat is about to change everything.",
};

export default function MovieDetailsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[650px] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.backdrop})`,
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-end gap-8 px-6 pb-16 md:px-10">
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

            <p className="mt-4 text-lg italic text-gray-300">
              {movie.tagline}
            </p>

            {/* Movie Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-300">
              <span className="flex items-center gap-1 font-semibold text-[#FF4C00]">
                ⭐ {movie.rating}
              </span>

              <span>{movie.releaseDate}</span>

              <span>{movie.runtime}</span>
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-[#FF4C00]/40 bg-[#FF4C00]/10 px-3 py-1 text-xs text-[#FF8A5C]"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="mt-5 max-w-xl leading-7 text-gray-300">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="rounded-lg bg-[#FF4C00] px-6 py-3 font-semibold text-white transition hover:bg-[#e64500]">
                ▶ Watch Now
              </button>

              <button className="rounded-lg border border-[#FF4C00]/50 bg-black/50 px-6 py-3 font-semibold text-white transition hover:bg-[#FF4C00]/10">
                + My List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* More sections will be added here */}

{/* Overview Section */}
<section className="border-t border-white/10 bg-black px-6 py-16 md:px-10">
  <div className="mx-auto max-w-7xl">
    <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
      
      {/* Overview */}
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4C00]">
          About the Movie
        </p>

        <h2 className="mb-5 text-3xl font-bold md:text-4xl">
          Overview
        </h2>

        <p className="max-w-3xl text-base leading-8 text-gray-400">
          {movie.overview}
        </p>
      </div>

      {/* Movie Information */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="mb-5 text-xl font-semibold">
          Movie Information
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-gray-500">Rating</span>
            <span className="font-medium text-[#FF4C00]">
              ⭐ {movie.rating}
            </span>
          </div>

          <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-gray-500">Release Date</span>
            <span className="text-gray-200">
              {movie.releaseDate}
            </span>
          </div>

          <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-gray-500">Runtime</span>
            <span className="text-gray-200">
              {movie.runtime}
            </span>
          </div>

          <div>
            <p className="mb-3 text-gray-500">Genres</p>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-[#FF4C00]/30 bg-[#FF4C00]/10 px-3 py-1 text-xs text-[#FF8A5C]"
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
<section className="bg-black px-6 py-16 md:px-10">
  <div className="mx-auto max-w-7xl">
    
    <div className="mb-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4C00]">
        Watch
      </p>

      <h2 className="text-3xl font-bold md:text-4xl">
        Official Trailer
      </h2>
    </div>

    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex h-full items-center justify-center">
        <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF4C00] text-2xl text-white shadow-lg transition hover:scale-105 hover:bg-[#e64500]">
          ▶
        </button>
      </div>
    </div>

  </div>
</section>

{/* Cast & Crew Section */}
<section className="bg-black px-6 py-16 md:px-10">
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
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

      {/* Cast 1 */}
      <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50">
        <div className="aspect-[3/4] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            👤
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white">
            Tom Holland
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Peter Parker
          </p>
        </div>
      </div>

      {/* Cast 2 */}
      <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50">
        <div className="aspect-[3/4] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            👤
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white">
            Zendaya
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            MJ
          </p>
        </div>
      </div>

      {/* Cast 3 */}
      <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50">
        <div className="aspect-[3/4] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            👤
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white">
            Mark Ruffalo
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Bruce Banner
          </p>
        </div>
      </div>

      {/* Cast 4 */}
      <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50">
        <div className="aspect-[3/4] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            👤
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white">
            Jacob Batalon
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Ned Leeds
          </p>
        </div>
      </div>

      {/* Cast 5 */}
      <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50">
        <div className="aspect-[3/4] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            👤
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white">
            Actor Name
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Character
          </p>
        </div>
      </div>

      {/* Cast 6 */}
      <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#FF4C00]/50">
        <div className="aspect-[3/4] overflow-hidden bg-white/5">
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            👤
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white">
            Actor Name
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Character
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

    </main>
  );
}