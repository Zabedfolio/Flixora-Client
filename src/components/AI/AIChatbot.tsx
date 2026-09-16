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
  movies?: MovieCard[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Recommend a top Sci-Fi movie",
  "What are the trending movies this week?",
  "Suggest something short and fun to watch",
  "Tell me about Interstellar",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("flixora_chat_history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            sender: "bot",
            text: "Hello! 👋 Welcome to Flixora AI Assistant. What kind of movie or show are you looking for today?",
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
    localStorage.setItem("flixora_chat_history", JSON.stringify(messages));
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
        text: "Chat cleared! How can I help you find movies or TV shows now?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setMessages(initialMsg);
    localStorage.removeItem("flixora_chat_history");
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
      // Build conversation history format for API payload
      const historyPayload = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const resData = await response.json();
      console.log(resData);

      if (resData.success) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: resData.data.message,
          movies: resData.data.movies || [],
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(resData.message || "Failed to fetch AI response");
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I'm having trouble connecting right now. Please check your network and try again.",
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
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">Flixora AI</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] bg-slate-900 border border-slate-800 sm:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-600/20 text-red-500 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Flixora AI Assistant
                </h3>
                <p className="text-xs text-slate-400">
                  Powered by Gemini & TMDB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white"
                      : "bg-slate-800 text-red-500"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-2 max-w-[82%]">
                  <div
                    className={`p-3 rounded-xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-red-600 text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Render Movie Poster Cards if present */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {msg.movies.map((movie) => (
                        <Link
                          href={`/movie/${movie.id}`}
                          key={movie.id}
                          onClick={()=> setIsOpen(false)}
                          className="flex items-center gap-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-red-600/50 p-2 rounded-lg cursor-pointer transition-all duration-200 group"
                        >
                          <div className="w-12 h-16 bg-slate-900 rounded overflow-hidden shrink-0 relative">
                            {movie.poster ? (
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <Film className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-500 transition-colors">
                              {movie.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              {movie.releaseDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-500" />
                                  {movie.releaseDate.split("-")[0]}
                                </span>
                              )}
                              {movie.rating ? (
                                <span className="flex items-center gap-1 text-yellow-400">
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
                <div className="w-7 h-7 rounded-full bg-slate-800 text-red-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800 border border-slate-700/50 p-3 rounded-xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length < 3 && !isTyping && (
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/60 bg-slate-950/50">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-full border border-slate-700/50 transition shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Flixora AI..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-600 transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
