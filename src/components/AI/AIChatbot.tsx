"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Minimize2,
  Maximize2,
  Play,
  Star,
  Film,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface RecommendedMovie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  posterUrl: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  movies?: RecommendedMovie[];
}

const QUICK_PROMPTS = [
  '🍿 Top Sci-Fi Hits',
  '🔥 Trending Movies',
  '⚡️ Action Packed',
  '🔖 Watchlist Guide'
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('flixora_chat_history');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            sender: 'bot',
            text: "Welcome to Flixora! 🎬 I'm Flix, your AI cinema guide. Tell me what mood or genre you're in, and I'll find your next favorite movie!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('flixora_chat_history', JSON.stringify(messages));
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, messages: updatedMessages }),
      });

      const data = await res.json();
      const fallback = generateAIResponse(query);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || fallback.text,
        movies: data.movies || fallback.movies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('AI Chat API error, using local cinema intelligence:', err);
      const fallback = generateAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallback.text,
          movies: fallback.movies,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (query: string): { text: string; movies?: RecommendedMovie[] } => {
    const q = query.toLowerCase().trim();

    if (/^(hi|hello|hey|hy|hola|sup|yo|good\s*(morning|afternoon|evening|night)|howdy|heyy+)\b/i.test(q)) {
      return {
        text: "Hey there! 👋 I'm Flix, your AI cinema guide on Flixora. 🎬\n\nWhat kind of movie or mood are you in today? Tell me a genre like Sci-Fi, Action, Horror, or Comedy — or ask me what's trending!"
      };
    }

    if (/(who are you|what is your name|what can you do|who made you|help|capabilities|what is flix)\b/i.test(q)) {
      return {
        text: "I'm **Flix**, Flixora's AI streaming assistant! 🍿\n\nHere is how I can help you today:\n• 🎬 Discover personalized movie & TV recommendations\n• 🔥 Explore trending blockbusters worldwide\n• 🔍 Search for titles, actors, or genres\n• 🔖 Learn how to manage your Watchlist & account"
      };
    }

    if (/(thanks|thank\s*you|thx|awesome|cool|great|sweet|perfect|appreciate)\b/i.test(q)) {
      return {
        text: "You're very welcome! 🍿 Let me know whenever you're ready for your next movie night. Enjoy streaming on Flixora!"
      };
    }

    if (/(bye|goodbye|cya|see\s*ya|night|gn)\b/i.test(q)) {
      return {
        text: "Goodbye! Have an awesome movie night! 🎬✨ Come back anytime you need great recommendations!"
      };
    }

    if (/sci[- ]?fi|science\s*fiction|scifi|space|alien|futuristic/i.test(q)) {
      return {
        text: "🚀 Here are top-tier Sci-Fi recommendations streaming on Flixora:",
        movies: [
          {
            id: '157336',
            title: 'Interstellar',
            year: 2014,
            rating: 8.7,
            genres: ['Sci-Fi', 'Drama'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
          },
          {
            id: '693134',
            title: 'Dune: Part Two',
            year: 2024,
            rating: 8.5,
            genres: ['Sci-Fi', 'Adventure'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLPoL6VFi8Uox0W2eeOcivqC.jpg'
          }
        ]
      };
    }

    if (/trending|popular|hits|top\s*rated|blockbuster/i.test(q)) {
      return {
        text: "🔥 Check out these hot trending blockbusters right now:",
        movies: [
          {
            id: '872585',
            title: 'Oppenheimer',
            year: 2023,
            rating: 8.9,
            genres: ['Drama', 'History'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGvjW21a2Yw.jpg'
          },
          {
            id: '569094',
            title: 'Spider-Man: Across the Spider-Verse',
            year: 2023,
            rating: 8.8,
            genres: ['Animation', 'Action'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/8Pt1vF4zMpjI2G4v2eg9GDWZ8sB.jpg'
          }
        ]
      };
    }

    if (/action|fight|superhero|explosive|martial\s*arts/i.test(q)) {
      return {
        text: "⚡️ High-octane action picks just for you:",
        movies: [
          {
            id: '550',
            title: 'Fight Club',
            year: 1999,
            rating: 8.8,
            genres: ['Action', 'Drama'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'
          },
          {
            id: '157336',
            title: 'Interstellar',
            year: 2014,
            rating: 8.7,
            genres: ['Sci-Fi', 'Action'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
          }
        ]
      };
    }

    if (/horror|scary|spooky|creepy|ghost|slasher|zombie/i.test(q)) {
      return {
        text: "👻 Thrilling Horror picks to give you goosebumps:",
        movies: [
          {
            id: '570',
            title: 'The Shining',
            year: 1980,
            rating: 8.2,
            genres: ['Horror', 'Thriller'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/xA23gGz2t40w10vS22a1n3M2n3M.jpg'
          },
          {
            id: '693134',
            title: 'Dune: Part Two',
            year: 2024,
            rating: 8.5,
            genres: ['Sci-Fi', 'Adventure'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLPoL6VFi8Uox0W2eeOcivqC.jpg'
          }
        ]
      };
    }

    if (q.includes('watchlist') || q.includes('saved')) {
      return {
        text: "🔖 Adding titles to your Watchlist is easy! Click the '+ Add to Watchlist' button on any movie card or detail page. You can manage your saved movies anytime in your User Dashboard."
      };
    }

    return {
      text: `Got it! Tell me more about what kind of movie or mood you are looking for, or try asking for Sci-Fi, Action, Horror, or Trending hits! 🍿`
    };
  };

  const handleClearChat = () => {
    const defaultMsg: ChatMessage[] = [
      {
        id: '1',
        sender: 'bot',
        text: "Chat cleared! How can I assist your movie night?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(defaultMsg);
    localStorage.removeItem('flixora_chat_history');
  };

  return (
    <div className="font-sans select-none">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md sm:hidden z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 25 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className={`fixed z-50 flex flex-col bg-zinc-950/95 border border-[#FF4C00]/35 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
              isExpanded
                ? 'inset-4 sm:inset-10 sm:w-auto sm:h-auto'
                : 'inset-x-3 top-12 bottom-20 sm:top-auto sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[410px] sm:h-[560px]'
            }`}
          >
            {/* Ambient Background Glow inside HUD */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4C00]/10 blur-[90px] rounded-full pointer-events-none" />

            {/* Header Bar */}
            <div className="relative z-10 bg-gradient-to-r from-[#FF4C00] via-[#FF6A00] to-[#E63900] px-4 py-3.5 flex items-center justify-between text-white shrink-0 shadow-xl">
              <div className="flex items-center gap-3">
                {/* Bot Icon */}
                <div className="relative p-2 bg-black/20 rounded-2xl border border-white/20 shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-950 rounded-full animate-pulse" />
                </div>

                <div>
                  <h3 className="font-black text-base tracking-tight flex items-center gap-1.5">
                    Flix <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </h3>
                  <p className="text-[11px] text-orange-100 font-semibold opacity-90 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-200" />
                    AI Movie Assistant & Guide
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat"
                  className="p-2 hover:bg-black/20 active:bg-black/30 rounded-xl transition text-white/90 hover:text-white cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse Window" : "Expand Window"}
                  className="hidden sm:block p-2 hover:bg-black/20 active:bg-black/30 rounded-xl transition text-white/90 hover:text-white cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-2 hover:bg-black/20 active:bg-black/30 rounded-xl transition text-white/90 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="relative z-10 flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/70 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex gap-2.5 text-xs max-w-[86%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'bot' ? (
                      <div className="w-8 h-8 rounded-2xl bg-[#FF4C00]/15 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0 mt-0.5 shadow-md shadow-[#FF4C00]/10">
                        <Bot className="w-4 h-4 text-[#FF4C00]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5 shadow-md">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-md whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#FF4C00] to-[#E63E00] text-white rounded-tr-none font-medium shadow-[#FF4C00]/20'
                          : 'bg-zinc-900/90 text-zinc-100 border border-zinc-800/90 rounded-tl-none shadow-black/50 backdrop-blur-md'
                      }`}
                    >
                      <p className="leading-relaxed text-[13px] sm:text-xs">{msg.text}</p>

                      {/* Rich Mini Movie Recommendation Cards if attached */}
                      {msg.movies && msg.movies.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
                          {msg.movies.map((m) => (
                            <Link
                              key={m.id}
                              href={`/movie/${m.id}`}
                              onClick={() => setIsOpen(false)}
                              className="group/item flex items-center gap-3 p-2 rounded-xl bg-black/50 border border-white/10 hover:border-[#FF4C00]/60 transition-all hover:bg-black/70 cursor-pointer"
                            >
                              <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                                <Image src={m.posterUrl} alt={m.title} fill className="object-cover group-hover/item:scale-105 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white group-hover/item:text-[#FF4C00] transition-colors truncate">
                                  {m.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                                  <span className="font-mono">{m.year}</span>
                                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    {m.rating}
                                  </span>
                                </div>
                              </div>
                              <span className="p-1.5 rounded-lg bg-[#FF4C00]/20 text-[#FF4C00] group-hover/item:bg-[#FF4C00] group-hover/item:text-white transition-all shrink-0">
                                <Play className="w-3 h-3 fill-current" />
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      <span
                        className={`block text-[9px] mt-1.5 text-right font-mono ${
                          msg.sender === 'user' ? 'text-orange-200' : 'text-zinc-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Animated Waveform Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 text-xs items-center"
                >
                  <div className="w-8 h-8 rounded-2xl bg-[#FF4C00]/15 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-[#FF4C00]" />
                  </div>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-md">
                    <span className="text-[10px] font-mono text-zinc-400 mr-1">Flix thinking</span>
                    <span className="w-1.5 h-3 bg-[#FF4C00] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-4 bg-[#FF4C00] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-2 bg-[#FF4C00] rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="relative z-10 px-3.5 py-2.5 bg-zinc-950/90 border-t border-zinc-800/80 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {QUICK_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 text-[11px] font-bold bg-zinc-900/90 hover:bg-[#FF4C00]/15 hover:border-[#FF4C00]/50 border border-zinc-800 text-zinc-300 hover:text-white rounded-full transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative z-10 p-3 bg-zinc-950 border-t border-zinc-800/90 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Flix about movies, genres, recommendations..."
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#FF4C00] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-[#FF4C00] hover:bg-[#e04300] disabled:opacity-40 disabled:hover:bg-[#FF4C00] text-white rounded-2xl transition-all duration-200 shadow-lg shadow-[#FF4C00]/20 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FF4C00] via-[#FF6A00] to-[#E63900] text-white shadow-[0_0_30px_rgba(255,76,0,0.45)] hover:shadow-[0_0_45px_rgba(255,76,0,0.65)] transition-all duration-300 cursor-pointer border border-white/20"
          aria-label="Toggle Flix AI Chat Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300" />
          ) : (
            <>
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110 drop-shadow-md text-white" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4C00] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-zinc-950 shadow-md" />
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
