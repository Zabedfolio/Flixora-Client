"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronLeft, ChevronRight, Send, Sparkles } from "lucide-react";
import { fetchFromTMDB, getTMDBImageUrl } from "@/data/tmdb";
import { getGenreName } from "@/data/home/newReleases";
import ReactMarkdown from "react-markdown";
import AiMovieResultCard, { AiMovie } from "./AIMovieResultCard";
import { authClient } from "@/app/(auth)/lib/auth-client";
import { Bebas_Neue, Plus_Jakarta_Sans, Caveat } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const caveat = Caveat({ weight: ["600", "700"], subsets: ["latin"] });

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
  aiMatch: number;
}

interface AiChatResult {
  message: string | null;
  movies: AiMovie[];
}

const AUTO_PLAY_INTERVAL = 6000;
const RESUME_DELAY = 8000;

const CINEMA_TAGLINES = [
  "READY FOR SHOWTIME,",
  "SPOTLIGHT ON,",
  "NOW STREAMING,",
  "LIGHTS, CAMERA,",
  "BINGE MODE ON,",
  "BACK TO THE REEL,"
];

export default function HeroBanner() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiChatResult | null>(null);
  const [username, setUsername] = useState("Viewer");
  const [tagline, setTagline] = useState("READY FOR SHOWTIME,");
  const { data: session } = authClient.useSession();
  const userName = session?.user.name ? session.user.name.split(' ')[0] : 'Viewer';

  // Load popular widescreen backdrops dynamically from TMDB API
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * CINEMA_TAGLINES.length);
    setTagline(CINEMA_TAGLINES[randomIndex]);
  }, []);

  useEffect(() => {
    fetchFromTMDB<{ results: any[] }>("/movie/popular?language=en-US&page=1")
      .then((data) => {
        if (data.results && data.results.length > 0) {
          // Take top 5 popular backdrops for widescreen banner slides
          const mapped = data.results.slice(0, 5).map((movie) => ({
            id: movie.id,
            image: getTMDBImageUrl(
              movie.backdrop_path || movie.poster_path,
              "original",
            ),
            title: movie.title,
            subtitle: movie.overview,
            highlight: `Popular in ${getGenreName(movie.genre_ids)}`,
            aiMatch: 92 + (movie.id % 8),
          }));
          setSlides(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching banner backdrops:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("flixora-session-role");
      if (savedRole === "admin") {
        setUsername("Admin");
      } else {
        setUsername("Viewer");
      }
    }
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);

    window.setTimeout(() => {
      setIsAutoPlaying(true);
    }, RESUME_DELAY);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  const goToNextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((previous) => (previous + 1) % slides.length);
    pauseAutoPlay();
  };

  const goToPreviousSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length,
    );
    pauseAutoPlay();
  };

  const runAiSearch = async (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    pauseAutoPlay();
    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmed,
          prompt: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI recommendation");
      }

      const result = await response.json();
      console.log("AI Search Result:", result);

      const message: string | null =
        result.reply ?? result.message ?? result.data?.message ?? null;

      const rawMovies =
        result.movies ?? result.data?.movies ?? result.data?.results ?? [];

      const movies: AiMovie[] = Array.isArray(rawMovies)
        ? rawMovies.map((movie: any) => ({
            id: Number(movie.id) || Math.floor(Math.random() * 10000),
            title: movie.title ?? movie.original_title ?? "Untitled",
            original_title: movie.original_title,
            overview: movie.overview,
            poster_path: movie.posterUrl ?? movie.poster_path ?? null,
            backdrop_path: movie.backdrop_path ?? null,
            release_date: movie.release_date ?? (movie.year ? String(movie.year) : undefined),
            vote_average: typeof movie.vote_average === "number" ? movie.vote_average : movie.rating,
            vote_count: movie.vote_count,
            media_type: movie.media_type,
          }))
        : [];

      setAiResult({ message, movies });
    } catch (error) {
      console.error("AI recommendation error:", error);

      setAiResult({
        message:
          "Sorry, I could not get movie recommendations right now. Please try again.",
        movies: [],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAiSearch(aiQuery);
  };

  const currentMovie = slides[currentSlide];

  if (loading || slides.length === 0) {
    return (
      <section className="relative h-screen min-h-[640px] w-full bg-black flex flex-col items-center justify-center">
        <span className="loading loading-spinner text-[#FF4C00] loading-lg"></span>
        <p className="text-[10px] text-zinc-500 mt-4 tracking-widest uppercase font-bold">
          Synchronizing Spotlight...
        </p>
      </section>
    );
  }

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{
            opacity: 0,
            scale: 1.05,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentMovie.image})`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Static Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-1" />
      <div className="absolute inset-0 bg-black/20 z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] opacity-25 z-1" />

      {/* Content */}
      <div className="flex h-full items-center relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.7,
          }}
          className="mt-50 w-11/12 md:w-8/12 mx-auto"
        >
          <div className="mb-6 text-center sm:text-left animate-in fade-in duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/15 border border-[#FF4C00]/30 text-[#FF4C00] text-[11px] font-bold tracking-widest uppercase mb-2 backdrop-blur-md">
              <Sparkles size={12} className="animate-pulse text-[#FF4C00]" />
              <span>AI Movie Engine</span>
            </div>

            <h2 className={`${bebas.className} text-4xl sm:text-5xl md:text-6xl tracking-wider text-white uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-x-3`}>
              <span>{tagline}</span>
              <span className={`${caveat.className} capitalize normal-case text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4C00] via-[#FF7A00] to-[#FF4C00] drop-shadow-[0_0_20px_rgba(255,76,0,0.6)] px-1 -rotate-2`}>
                {userName}!
              </span>
            </h2>

            <p className={`${jakarta.className} text-xs md:text-sm text-zinc-300 font-semibold tracking-widest uppercase mt-1 opacity-90`}>
              Our bot will help you find movies based on your mood
            </p>
          </div>

          <form
            onSubmit={handleAiSubmit}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-[#000000]/60 p-2.5 backdrop-blur-lg focus-within:border-[#FF4C00] focus-within:shadow-[0_0_20px_rgba(255,76,0,0.25)] transition-all duration-300"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FF4C00]/15 border border-[#FF4C00]/30">
              <Bot size={16} className="text-[#FF4C00]" />
            </div>

            <input
              type="text"
              value={aiQuery}
              onChange={(event) => setAiQuery(event.target.value)}
              placeholder="Ask Flix AI what to watch tonight..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              aria-label="Ask Flix AI"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FF4C00] text-black transition-transform duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send size={14} />
            </button>
          </form>

          {/* AI response - Only cards in Hero Banner */}
          <AnimatePresence mode="wait">
            {(aiLoading || aiResult) && (
              <motion.div
                key={aiLoading ? "loading" : "response"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-3 rounded-2xl border border-[#FF4C00]/30 bg-zinc-950/90 p-3 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-20 relative font-sans"
              >
                {aiLoading ? (
                  <div className="flex items-center gap-2.5 px-2 py-1">
                    <Sparkles size={14} className="flex-shrink-0 text-[#FF4C00] animate-pulse" />
                    <span className="text-xs font-medium text-zinc-400">
                      Flix AI is discovering movies for you...
                    </span>
                  </div>
                ) : (
                  aiResult && (
                    <>
                      {/* Movie results carousel - ONLY CARDS */}
                      {aiResult.movies.length > 0 ? (
                        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-1 scrollbar-none">
                          {aiResult.movies.map((movie, index) => (
                            <AiMovieResultCard
                              key={movie.id}
                              movie={movie}
                              index={index}
                              onSelect={(m) => router.push(`/movie/${m.id}`)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Sparkles size={14} className="text-zinc-500" />
                          <p className="text-xs font-medium text-zinc-400">
                            No movie matches found for that search — try another genre or title.
                          </p>
                        </div>
                      )}
                    </>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Previous */}
      <button
        type="button"
        onClick={goToPreviousSlide}
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-[#FF4C00] md:flex"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={goToNextSlide}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-[#FF4C00] md:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
              ? "w-10 bg-[#FF4C00]"
              : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center text-[10px] font-bold tracking-widest text-white/50 sm:flex">
        SCROLL TO EXPLORE
        <div className="mt-2 h-8 w-px animate-bounce bg-linear-to-b from-transparent via-[#FF4C00] to-transparent" />
      </div>
    </section>
  );
}