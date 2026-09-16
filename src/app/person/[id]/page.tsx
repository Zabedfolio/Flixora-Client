export default function PersonDetailsPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Profile Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="grid items-center gap-10 md:grid-cols-2">

          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="h-[420px] w-[300px] overflow-hidden rounded-2xl border-2 border-[#FF4C00] shadow-[0_0_30px_rgba(255,76,0,0.25)]">

              <img
                src="https://image.tmdb.org/t/p/w500/placeholder.jpg"
                alt="Actor"
                className="h-full w-full object-cover"
              />

            </div>
          </div>

          {/* Person Information */}
          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#FF4C00]">
              Actor / Actress
            </p>

            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Tom Holland
            </h1>

            <p className="mb-4 text-gray-400">
              Date of Birth: 1 June 1996
            </p>

            <p className="mb-8 text-gray-400">
              Place of Birth: London, England
            </p>

            <p className="max-w-xl leading-7 text-gray-300">
              An actor known for his performances in popular movies and
              television productions.
            </p>

          </div>

        </div>

      </section>


    {/* Biography Section */}
<section className="mx-auto max-w-6xl px-6 pb-16">
  <div className="border-t border-white/10 pt-12">
    <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#FF4C00]">
      About
    </p>

    <h2 className="mb-5 text-3xl font-bold">
      About Tom Holland
    </h2>

    <p className="max-w-4xl leading-8 text-gray-400">
      Tom Holland is an actor known for his performances in popular
      movies and television productions. He has appeared in several
      successful films and has gained recognition for his acting
      performances.
    </p>
  </div>
</section>

{/* Personal Information Section */}
<section className="mx-auto max-w-6xl px-6 pb-16">
  <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#FF4C00]">
    Personal Information
  </p>

  <h2 className="mb-8 text-3xl font-bold">
    Personal Details
  </h2>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-2 text-sm text-gray-500">Birthday</p>
      <p className="font-semibold text-white">1 June 1996</p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-2 text-sm text-gray-500">Place of Birth</p>
      <p className="font-semibold text-white">London, England</p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-2 text-sm text-gray-500">Known For</p>
      <p className="font-semibold text-white">Acting</p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-2 text-sm text-gray-500">Popularity</p>
      <p className="font-semibold text-[#FF4C00]">45.32</p>
    </div>

  </div>
</section>

{/* Filmography Section */}
<section className="mx-auto max-w-6xl px-6 pb-20">
  <div className="mb-8 flex items-end justify-between">
    <div>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#FF4C00]">
        Filmography
      </p>

      <h2 className="text-3xl font-bold md:text-4xl">
        Known For
      </h2>
    </div>

    <button className="hidden rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:border-[#FF4C00] hover:text-[#FF4C00] sm:block">
      View All
    </button>
  </div>

  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

    {/* Movie 1 */}
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
        <img
          src="https://image.tmdb.org/t/p/w500/placeholder.jpg"
          alt="Movie"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-1 text-xs text-[#FF4C00]">
          ★ 8.2
        </div>
      </div>

      <h3 className="mt-3 truncate font-semibold text-white">
        Spider-Man
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        2021
      </p>
    </div>

    {/* Movie 2 */}
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
        <img
          src="https://image.tmdb.org/t/p/w500/placeholder.jpg"
          alt="Movie"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-1 text-xs text-[#FF4C00]">
          ★ 8.0
        </div>
      </div>

      <h3 className="mt-3 truncate font-semibold text-white">
        Uncharted
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        2022
      </p>
    </div>

    {/* Movie 3 */}
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
        <img
          src="https://image.tmdb.org/t/p/w500/placeholder.jpg"
          alt="Movie"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-1 text-xs text-[#FF4C00]">
          ★ 7.8
        </div>
      </div>

      <h3 className="mt-3 truncate font-semibold text-white">
        The Impossible
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        2012
      </p>
    </div>

    {/* Movie 4 */}
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
        <img
          src="https://image.tmdb.org/t/p/w500/placeholder.jpg"
          alt="Movie"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-1 text-xs text-[#FF4C00]">
          ★ 7.9
        </div>
      </div>

      <h3 className="mt-3 truncate font-semibold text-white">
        Cherry
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        2021
      </p>
    </div>

    {/* Movie 5 */}
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
        <img
          src="https://image.tmdb.org/t/p/w500/placeholder.jpg"
          alt="Movie"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-1 text-xs text-[#FF4C00]">
          ★ 7.6
        </div>
      </div>

      <h3 className="mt-3 truncate font-semibold text-white">
        In the Heart of the Sea
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        2015
      </p>
    </div>

  </div>
</section>

{/* Bottom CTA */}
<section className="mx-auto max-w-6xl px-6 pb-24">
  <div className="relative overflow-hidden rounded-2xl border border-[#FF4C00]/20 bg-gradient-to-r from-[#FF4C00]/10 to-transparent p-8 md:p-12">

    <div className="relative z-10 max-w-2xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#FF4C00]">
        Explore More
      </p>

      <h2 className="text-2xl font-bold md:text-3xl">
        Discover more movies featuring this actor
      </h2>

      <p className="mt-3 text-gray-400">
        Explore the filmography and discover more movies on Flixora.
      </p>

      <button className="mt-6 rounded-lg bg-[#FF4C00] px-6 py-3 font-semibold text-white transition hover:bg-[#e64400]">
        Explore Movies
      </button>
    </div>

  </div>
</section>

    </main>
  );
}