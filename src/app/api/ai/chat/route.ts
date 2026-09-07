import { NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';

const KIMI_API_KEY = process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY || 'sk-ugEIwTHItxvA5xEWPDjf89TG5O1Sq9wwv6Rqwzatx21IyTLz';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], query = '' } = body;

    const userMessage = (query || (messages.length > 0 ? messages[messages.length - 1].text : '')).trim();
    const qLower = userMessage.toLowerCase();

    // Parse requested count (e.g. "suggest 5 movies" -> 5)
    const countMatch = qLower.match(/\b([1-9]|10)\b/);
    const requestedCount = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 6) : 4;

    // Helper function to extract TMDB movies array with dynamic count
    const extractMovies = (results: any[], count: number = 4) => {
      return (results || []).slice(0, count).map((m: any) => ({
        id: m.id.toString(),
        title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : 2026,
        rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
        genres: ['Featured'],
        posterUrl: getTMDBImageUrl(m.poster_path, 'w500'),
        overview: m.overview || '',
      }));
    };

    // Helper to build rich AI markdown response listing items
    const buildAIReply = (emoji: string, category: string, moviesList: any[]) => {
      if (!moviesList || moviesList.length === 0) {
        return `${emoji} Here are top ${category} movies for you on Flixora:`;
      }
      const lines = [
        `${emoji} Here are ${moviesList.length} top ${category} recommendations for your movie night:\n`
      ];
      moviesList.forEach((m, idx) => {
        const yearStr = m.year ? ` (${m.year})` : '';
        const ratingStr = m.rating ? ` ⭐ ${m.rating}` : '';
        const descStr = m.overview ? ` — *${m.overview.slice(0, 70)}...*` : '';
        lines.push(`${idx + 1}. **${m.title}**${yearStr}${ratingStr}${descStr}`);
      });
      return lines.join('\n');
    };

    // 1. Try calling Kimi / Moonshot AI API Endpoint if key is available
    if (KIMI_API_KEY) {
      try {
        const kimiRes = await fetch('https://api.moonshot.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIMI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [
              {
                role: 'system',
                content:
                  'You are Flix, a warm, intelligent, human-like AI cinema companion for Flixora. Speak naturally like a real friendly movie buff. For simple greetings (like "hi", "hello", "hey"), welcome the user warmly without treating the greeting as a movie title search or saying formulaic phrases like "Thanks for asking about...". Only attach movie recommendations when relevant.',
              },
              ...messages.map((m: any) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
              })),
            ],
            temperature: 0.7,
          }),
        });

        if (kimiRes.ok) {
          const kimiData = await kimiRes.json();
          const aiText = kimiData.choices?.[0]?.message?.content;
          if (aiText) {
            const isGreeting = /^(hi|hello|hey|hy|hola|sup|yo|good\s*(morning|afternoon|evening|night)|howdy|heyy+)\b/i.test(qLower);
            let movies = undefined;

            if (!isGreeting) {
              let searchEndpoint = `/search/movie?query=${encodeURIComponent(userMessage.slice(0, 30))}&language=en-US&page=1`;
              if (/sci[- ]?fi|science\s*fiction|scifi|space/i.test(qLower)) {
                searchEndpoint = '/discover/movie?with_genres=878&sort_by=popularity.desc&language=en-US&page=1';
              } else if (/action|fight|superhero/i.test(qLower)) {
                searchEndpoint = '/discover/movie?with_genres=28&sort_by=popularity.desc&language=en-US&page=1';
              } else if (/horror|scary|spooky/i.test(qLower)) {
                searchEndpoint = '/discover/movie?with_genres=27&sort_by=popularity.desc&language=en-US&page=1';
              } else if (/comedy|funny|hilarious/i.test(qLower)) {
                searchEndpoint = '/discover/movie?with_genres=35&sort_by=popularity.desc&language=en-US&page=1';
              }

              let tmdbData = await fetchFromTMDB<any>(searchEndpoint).catch(() => null);
              if (!tmdbData?.results?.length) {
                tmdbData = await fetchFromTMDB<any>('/trending/movie/day?language=en-US&page=1').catch(() => null);
              }
              const extracted = extractMovies(tmdbData?.results, requestedCount);
              if (extracted.length > 0) movies = extracted;
            }

            return NextResponse.json({
              success: true,
              reply: aiText,
              movies,
              source: 'kimi',
            });
          }
        }
      } catch (kimiErr) {
        console.warn('Kimi API call error, using local AI cinema intelligence:', kimiErr);
      }
    }

    // 2. Intelligent AI Conversation & Cinema Engine
    const isGreeting = /^(hi|hello|hey|hy|hola|sup|yo|good\s*(morning|afternoon|evening|night)|howdy|heyy+)\b/i.test(qLower);
    const isIdentity = /(who are you|what is your name|what can you do|who made you|help|capabilities|what is flix)\b/i.test(qLower);
    const isGratitude = /(thanks|thank\s*you|thx|awesome|cool|great|sweet|perfect|appreciate)\b/i.test(qLower);
    const isFarewell = /(bye|goodbye|cya|see\s*ya|night|gn)\b/i.test(qLower);
    const isWatchlist = /(watchlist|save|download|subscription|payment|account|profile)\b/i.test(qLower);

    if (isGreeting) {
      return NextResponse.json({
        success: true,
        reply: "Hey there! 👋 I'm Flix, your AI cinema guide on Flixora. 🎬\n\nWhat kind of movie or mood are you in today? You can ask me for genre recommendations (like Sci-Fi, Action, Horror, or Comedy), trending hits, or search for any movie title!",
        source: 'ai_engine'
      });
    }

    if (isIdentity) {
      return NextResponse.json({
        success: true,
        reply: "I'm **Flix**, Flixora's AI streaming assistant! 🍿\n\nHere is how I can help you today:\n• 🎬 Discover personalized movie & TV recommendations\n• 🔥 Explore trending blockbusters worldwide\n• 🔍 Search for titles, actors, or genres\n• 🔖 Learn how to manage your Watchlist & account",
        source: 'ai_engine'
      });
    }

    if (isGratitude) {
      return NextResponse.json({
        success: true,
        reply: "You're very welcome! 🍿 Let me know whenever you're ready for your next movie night. Enjoy streaming on Flixora!",
        source: 'ai_engine'
      });
    }

    if (isFarewell) {
      return NextResponse.json({
        success: true,
        reply: "Goodbye! Have an awesome movie night! 🎬✨ Come back anytime you need great recommendations!",
        source: 'ai_engine'
      });
    }

    if (isWatchlist) {
      return NextResponse.json({
        success: true,
        reply: "🔖 **Flixora Watchlist Guide**:\n\nTo save any movie to your collection, click the **'+ Add to Watchlist'** button on any movie card or detail page. You can access your saved titles anytime from your User Dashboard!",
        source: 'ai_engine'
      });
    }

    // Flexible Genre and Movie Intent handling with TMDB rich cards
    let tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
    let categoryName = 'Popular';
    let emojiHeader = '🍿';

    if (/sci[- ]?fi|science\s*fiction|scifi|space|alien|futuristic/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=878&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Sci-Fi';
      emojiHeader = '🚀';
    } else if (/action|fight|superhero|explosive|martial\s*arts/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=28&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Action';
      emojiHeader = '⚡️';
    } else if (/trending|popular|hits|top\s*rated|blockbuster/i.test(qLower)) {
      tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
      categoryName = 'Trending Blockbuster';
      emojiHeader = '🔥';
    } else if (/horror|scary|spooky|creepy|ghost|slasher|zombie|vampire/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=27&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Horror';
      emojiHeader = '👻';
    } else if (/comedy|funny|hilarious|laugh|humor/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=35&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Hilarious Comedy';
      emojiHeader = '🍿';
    } else if (/anime|animation|animated|cartoon/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=16&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Animation & Anime';
      emojiHeader = '✨';
    } else if (/thriller|suspense|crime|mystery|detective/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=53&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Suspenseful Thriller';
      emojiHeader = '🔍';
    } else if (/romance|romantic|love\s*movie|date\s*night/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=10749&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Romantic';
      emojiHeader = '❤️';
    } else if (/drama|emotional/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=18&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Drama';
      emojiHeader = '🎭';
    } else if (/fantasy|adventure|magic/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=14&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Fantasy & Adventure';
      emojiHeader = '⚔️';
    } else if (/recommend|suggest|what\s*(should|to)\s*watch|movie\s*night|good\s*movie/i.test(qLower)) {
      tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
      categoryName = 'Movie Night';
      emojiHeader = '🍿';
    } else if (userMessage) {
      tmdbEndpoint = `/search/movie?query=${encodeURIComponent(userMessage)}&language=en-US&page=1`;
      categoryName = `"${userMessage}" Search`;
      emojiHeader = '🎬';
    }

    let tmdbData = await fetchFromTMDB<any>(tmdbEndpoint).catch(() => ({ results: [] }));

    // Fallback to trending if search returned no results
    if (!tmdbData?.results?.length && userMessage) {
      tmdbData = await fetchFromTMDB<any>('/trending/movie/day?language=en-US&page=1').catch(() => ({ results: [] }));
      categoryName = 'Trending Movie';
      emojiHeader = '🎬';
    }

    const movies = extractMovies(tmdbData?.results, requestedCount);
    const replyText = buildAIReply(emojiHeader, categoryName, movies);

    return NextResponse.json({
      success: true,
      reply: replyText,
      movies: movies.length > 0 ? movies : undefined,
      source: 'tmdb',
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      success: true,
      reply: "Hey! I'm Flix, your AI cinema guide! Tell me what mood or genre you want to watch tonight.",
    });
  }
}
