import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  User,
  Film,
  Minimize2
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Recommend a top Sci-Fi movie',
  'What are the trending movies this week?',
  'Suggest something short and fun to watch',
  'How do I manage my streaming watchlist?'
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('flixora_chat_history');
    return saved
      ? JSON.parse(saved)
      : [
        {
          id: '1',
          sender: 'bot',
          text: 'Hello! 👋 Welcome to Flixora AI Assistant. What kind of movie or show are you looking for today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Sync chat messages to localStorage
  useEffect(() => {
    localStorage.setItem('flixora_chat_history', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulated AI response (Replace with your API call)
    setTimeout(() => {
      const botResponse = generateAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('sci-fi') || q.includes('science fiction')) {
      return '🚀 Highly recommended Sci-Fi picks on Flixora:\n\n1. Interstellar (2014) - Sci-Fi/Drama\n2. Blade Runner 2049 (2017) - Sci-Fi/Cyberpunk\n3. Dune: Part Two (2024) - Epic Sci-Fi';
    }
    if (q.includes('trending') || q.includes('popular')) {
      return '🔥 Trending right now:\n\n1. Oppenheimer\n2. The Dark Knight\n3. Stranger Things\n\nCheck out the "Trending Now" carousel on the home page for direct streaming links!';
    }
    if (q.includes('watchlist') || q.includes('saved')) {
      return '🔖 You can add any movie or show to your personal Watchlist by clicking the "+ Add to Watchlist" button on any movie card or detail page.';
    }
    return `Thanks for asking about "${query}"! I'm here to help you find movies, genres, and streaming information on Flixora. Try asking for specific genres or trending movies!`;
  };

  const handleClearChat = () => {
    const defaultMsg = [
      {
        id: '1',
        sender: 'bot',
        text: 'Chat cleared! How can I assist you with movies today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(defaultMsg);
    localStorage.removeItem('flixora_chat_history');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 px-4 py-3 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative p-1.5 bg-white/10 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  Flixora AI <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                </h3>
                <p className="text-[10px] text-red-100 opacity-90">Movie Assistant & Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm whitespace-pre-wrap ${msg.sender === 'user'
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-none'
                    }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-red-200' : 'text-slate-400'
                      }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 text-xs items-center">
                <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/90 text-slate-400 border border-slate-700/60 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800/60 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-full transition shrink-0"
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
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about movies, recommendations..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-red-500/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white rounded-xl transition shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-xl hover:shadow-red-900/40 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open AI Chat Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <>
            <Bot className="w-7 h-7 transition-transform duration-200 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-slate-900" />
            </span>
          </>
        )}
      </button>
    </div>
  );
}
