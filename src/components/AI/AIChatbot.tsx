import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Star,
  Film,
  Calendar,
  ChevronRight,
  Flame,
  Ghost,
  Smile,
  Zap,
  Globe,
  Rocket,
  Heart,
  ShieldAlert,
  Film as MovieIcon,
} from "lucide-react";
import Link from "next/link";

interface MovieCard {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  overview?: string;
  releaseDate?: string;
  rating?: number;
  poster?: string | null;
  backdropPath?: string | null;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: string[];
  movies?: MovieCard[];
  timestamp: string;
}

// Icon mapper helper using Lucide React icons
const getOptionIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("horror") || n.includes("scary")) return <Ghost className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("funny") || n.includes("comedy")) return <Smile className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("action") || n.includes("fight")) return <Zap className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("bangla") || n.includes("regional") || n.includes("hindi") || n.includes("korean")) return <Globe className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("sci-fi") || n.includes("space")) return <Rocket className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("roman") || n.includes("love")) return <Heart className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("crime") || n.includes("thriller")) return <ShieldAlert className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  if (n.includes("trending") || n.includes("popular")) return <Flame className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
  return <MovieIcon className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black transition-colors" />;
};

const QUICK_PROMPTS = [
  { label: "Horror Movies", icon: <Ghost className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black" /> },
  { label: "Funny Comedy", icon: <Smile className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black" /> },
  { label: "Bangla Movies", icon: <Globe className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black" /> },
  { label: "Sci-Fi Hits", icon: <Rocket className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black" /> },
  { label: "Trending Today", icon: <Flame className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black" /> },
  { label: "Movies like Inception", icon: <Sparkles className="w-3.5 h-3.5 text-[#FF4C00] group-hover:text-black" /> },
];

// Simple Markdown Renderer component matching Flixora design system
const FormattedMessage = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed font-sans">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Parse **bold** and *italics*
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-extrabold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <em key={pIdx} className="text-zinc-400 italic">
                {part.slice(1, -1)}
              </em>
            );
          }
          return part;
        });

        // Bullet point
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#FF4C00] font-black">•</span>
              <span>{renderedLine}</span>
            </div>
          );
        }

        return <p key={idx}>{renderedLine}</p>;
      })}
    </div>
  );
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flixora_chat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore error
        }
      }
    }
    return [
      {
        id: "1",
        sender: "bot",
        text: "Welcome to Flixora AI Assistant. What movie, genre, or TV show are you looking for today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Sync history to localStorage & auto-scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("flixora_chat_history", JSON.stringify(messages));
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // Prevent background scrolling on mobile modal open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClearHistory = () => {
    const initialMsg: ChatMessage[] = [
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Chat cleared! How can I help you find your next movie or TV show on Flixora?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setMessages(initialMsg);
    if (typeof window !== "undefined") {
      localStorage.removeItem("flixora_chat_history");
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          prompt: query,
          messages: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const resData = await response.json().catch(() => null);

      if (resData && resData.success) {
        const rawMovies = resData.movies || resData.data?.movies || [];
        const replyText =
          resData.reply ||
          resData.data?.message ||
          resData.message ||
          "Here are recommendations for you:";

const formatPosterUrl = (path: string | null | undefined): string => {
  if (!path) {
    return "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/w500${cleanPath}`;
};

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: replyText,
          options: resData.options,
          movies: rawMovies.map((m: any) => {
            const rawPoster = m.posterUrl || m.poster_path || m.poster || m.backdrop_path || m.backdropPath;
            const ratingRaw = m.rating || m.vote_average || 8.0;
            const yearRaw = m.releaseDate || m.release_date || m.first_air_date || (m.year ? String(m.year) : "");
            const yearFormatted = yearRaw ? String(yearRaw).split("-")[0] : "";
            return {
              id: Number(m.id),
              title: m.title || m.name || "Featured Title",
              mediaType: m.media_type || m.mediaType || "movie",
              overview: m.overview || "",
              releaseDate: yearFormatted,
              rating: typeof ratingRaw === "number" ? Number(ratingRaw.toFixed(1)) : 8.0,
              poster: formatPosterUrl(rawPoster),
            };
          }),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "I'm Flix, your Flixora AI guide! Ask me for movie recommendations by genre (Horror, Comedy, Action, Bangla) or search any movie title!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I'm right here! What kind of movie or genre (Horror, Comedy, Action, Bangla) would you like to explore tonight?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button - Styled with Flixora #FF4C00 Theme */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#FF4C00] hover:bg-[#ff6222] text-black px-5 py-3.5 rounded-full shadow-[0_0_25px_rgba(255,76,0,0.35)] transition-all duration-300 hover:scale-105 group border border-[#FF4C00]/40 font-black tracking-wide"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black rounded-full ring-2 ring-[#FF4C00] animate-ping" />
          </div>
          <span className="text-sm uppercase tracking-wider font-extrabold">Flixora AI</span>
        </button>
      )}

      {/* Chatbot Window - Matched with Flixora Theme (Dark Zinc, #FF4C00 Accents) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[640px] bg-[#0A0A0A]/98 backdrop-blur-2xl border border-zinc-800 sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#121212] px-4 py-3.5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-[#FF4C00]/20 text-[#FF4C00] rounded-xl border border-[#FF4C00]/30 shadow-inner">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-[#FF4C00] rounded-full ring-2 ring-[#0A0A0A]" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-2">
                  FLIXORA AI
                  <span className="text-[9px] font-black uppercase tracking-widest bg-[#FF4C00] text-black px-2 py-0.5 rounded-md">
                    AI Assistant
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C00] inline-block animate-pulse" />
                  Streaming Intelligence Engine
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black shadow-md ${
                    msg.sender === "user"
                      ? "bg-[#FF4C00] text-black"
                      : "bg-[#141414] text-[#FF4C00] border border-zinc-800"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-2.5 max-w-[85%]">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#FF4C00] text-black font-bold rounded-tr-xs shadow-[0_0_15px_rgba(255,76,0,0.2)]"
                        : "bg-[#141414] text-zinc-200 rounded-tl-xs border border-zinc-800"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <FormattedMessage text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>

                  {/* Render Interactive Option Buttons (Theme Matched) */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSendMessage(opt)}
                          className="flex items-center gap-1.5 text-xs bg-[#1A1A1A] hover:bg-[#FF4C00] text-zinc-300 hover:text-black px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-[#FF4C00] transition-all font-bold shadow-sm cursor-pointer group"
                        >
                          {getOptionIcon(opt)}
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Movie Poster Cards (Matched with Flixora MediaCard Design) */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {msg.movies.map((movie) => (
                        <Link
                          href={`/movie/${movie.id}`}
                          key={movie.id}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 bg-[#141414] hover:bg-[#1A1A1A] border border-zinc-800 hover:border-[#FF4C00]/60 p-2.5 rounded-xl cursor-pointer transition-all duration-200 group shadow-md"
                        >
                          <div className="w-12 h-16 bg-zinc-950 rounded-lg overflow-hidden shrink-0 relative border border-zinc-900 group-hover:border-[#FF4C00]/40">
                            {movie.poster ? (
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                <Film className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pr-1">
                            <h4 className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-[#FF4C00] transition-colors flex items-center justify-between">
                              <span>{movie.title}</span>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#FF4C00] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 mt-1">
                              {movie.releaseDate && (
                                <span className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                                  <Calendar className="w-3 h-3 text-zinc-500" />
                                  {movie.releaseDate.split("-")[0]}
                                </span>
                              )}
                              {movie.rating ? (
                                <span className="flex items-center gap-1 bg-black/60 border border-zinc-800 px-2 py-0.5 rounded text-white">
                                  <Star className="w-3 h-3 text-[#FF4C00] fill-current" />
                                  {movie.rating}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-zinc-500 font-mono block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-[#141414] border border-zinc-800 text-[#FF4C00] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#141414] border border-zinc-800 p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#FF4C00] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#FF4C00] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-[#FF4C00] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Bar */}
          {!isTyping && (
            <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-zinc-800 bg-[#121212]">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.label)}
                  className="flex items-center gap-1.5 whitespace-nowrap text-xs bg-[#1A1A1A] hover:bg-[#FF4C00] text-zinc-300 hover:text-black px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-[#FF4C00] transition-all shrink-0 font-bold cursor-pointer group"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3.5 bg-[#121212] border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Flixora AI..."
              className="flex-1 bg-[#0A0A0A] border border-zinc-800 focus:border-[#FF4C00] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-[#FF4C00] hover:bg-[#ff6222] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-extrabold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
