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

// Icon mapper helper for Lucide icons (replaces emojis completely)
const getOptionIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("horror") || n.includes("scary")) return <Ghost className="w-3.5 h-3.5 text-purple-400" />;
  if (n.includes("funny") || n.includes("comedy")) return <Smile className="w-3.5 h-3.5 text-amber-400" />;
  if (n.includes("action") || n.includes("fight")) return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
  if (n.includes("bangla") || n.includes("regional") || n.includes("hindi") || n.includes("korean")) return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
  if (n.includes("sci-fi") || n.includes("space")) return <Rocket className="w-3.5 h-3.5 text-cyan-400" />;
  if (n.includes("roman") || n.includes("love")) return <Heart className="w-3.5 h-3.5 text-rose-400" />;
  if (n.includes("crime") || n.includes("thriller")) return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
  if (n.includes("trending") || n.includes("popular")) return <Flame className="w-3.5 h-3.5 text-orange-400" />;
  return <MovieIcon className="w-3.5 h-3.5 text-slate-400" />;
};

const QUICK_PROMPTS = [
  { label: "Horror Movies", icon: <Ghost className="w-3.5 h-3.5 text-purple-400" /> },
  { label: "Funny Comedy", icon: <Smile className="w-3.5 h-3.5 text-amber-400" /> },
  { label: "Bangla Movies", icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
  { label: "Sci-Fi Hits", icon: <Rocket className="w-3.5 h-3.5 text-cyan-400" /> },
  { label: "Trending Today", icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
  { label: "Movies like Inception", icon: <Sparkles className="w-3.5 h-3.5 text-red-400" /> },
];

// Simple Markdown Renderer component to format AI text responses nicely
const FormattedMessage = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Parse **bold** and *italics*
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <em key={pIdx} className="text-slate-300 italic">
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
              <span className="text-red-500 font-bold">•</span>
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
        text: "Hello! Welcome to Flixora AI Assistant. What kind of movie, genre, or TV show are you looking for today?",
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
        text: "Chat cleared! How can I help you find your next movie or TV show?",
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

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: replyText,
          options: resData.options,
          movies: rawMovies.map((m: any) => ({
            id: Number(m.id),
            title: m.title || m.name || "Featured Title",
            mediaType: m.media_type || m.mediaType || "movie",
            overview: m.overview || "",
            releaseDate:
              m.release_date ||
              m.first_air_date ||
              (m.year ? String(m.year) : ""),
            rating: m.rating || m.vote_average || 8.0,
            poster: m.posterUrl || m.poster_path || m.poster || null,
            backdropPath: m.backdrop_path || null,
          })),
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
          text: "Hey! I'm Flix, your AI cinema guide! Ask me for genre suggestions like **Horror**, **Funny**, **Bangla**, or **Sci-Fi** movies!",
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
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-red-900/40 border border-red-400/30 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
          </div>
          <span className="font-semibold text-sm tracking-wide">Flixora AI</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[640px] bg-slate-950/95 backdrop-blur-2xl border border-slate-800/80 sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-slate-900/90 px-4 py-3.5 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-gradient-to-br from-red-600/30 to-rose-600/20 text-red-500 rounded-2xl border border-red-500/20 shadow-inner">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                  Flixora AI Assistant
                  <span className="text-[10px] font-normal bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                    Kimi & Gemini
                  </span>
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Your Intelligent Cinema Companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-red-600 to-rose-600 text-white"
                      : "bg-slate-900 text-red-500 border border-slate-800"
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
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white rounded-tr-xs font-medium"
                        : "bg-slate-900/90 text-slate-200 rounded-tl-xs border border-slate-800/80"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <FormattedMessage text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>

                  {/* Render Interactive Clarification Option Buttons if present */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSendMessage(opt)}
                          className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-red-600/20 hover:border-red-500/60 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 transition-all font-medium shadow-sm group"
                        >
                          {getOptionIcon(opt)}
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Movie Poster Cards if present */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {msg.movies.map((movie) => (
                        <Link
                          href={`/movie/${movie.id}`}
                          key={movie.id}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/50 p-2.5 rounded-2xl cursor-pointer transition-all duration-200 group shadow-lg"
                        >
                          <div className="w-12 h-16 bg-slate-950 rounded-xl overflow-hidden shrink-0 relative border border-slate-800">
                            {movie.poster ? (
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <Film className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pr-1">
                            <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors flex items-center justify-between">
                              <span>{movie.title}</span>
                              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              {movie.releaseDate && (
                                <span className="flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded text-[11px]">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {movie.releaseDate.split("-")[0]}
                                </span>
                              )}
                              {movie.rating ? (
                                <span className="flex items-center gap-1 text-yellow-400 font-medium text-[11px] bg-yellow-400/10 px-1.5 py-0.5 rounded">
                                  <Star className="w-3 h-3 fill-yellow-400" />
                                  {movie.rating}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-red-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          {!isTyping && (
            <div className="px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 bg-slate-900/60">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.label)}
                  className="flex items-center gap-1.5 whitespace-nowrap text-xs bg-slate-800/90 hover:bg-red-600/20 hover:border-red-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700/60 transition-all shrink-0 font-medium"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Flixora AI..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
