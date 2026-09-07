import { NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const KIMI_API_KEY = process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY || '';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || '';
    const userId = searchParams.get('userId') || '';

    const res = await fetch(`${SERVER_URL}/api/ai/chat/history?sessionId=${encodeURIComponent(sessionId)}&userId=${encodeURIComponent(userId)}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn('Backend GET chat history failed, returning empty list:', err);
  }
  return NextResponse.json({ success: true, messages: [] });
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const sessionId = body.sessionId || searchParams.get('sessionId') || '';
    const userId = body.userId || searchParams.get('userId') || '';

    const res = await fetch(`${SERVER_URL}/api/ai/chat/history`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId })
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn('Backend DELETE chat history failed:', err);
  }
  return NextResponse.json({ success: true, message: 'Chat history cleared' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], query = '', sessionId, userId } = body;

    const userMessage = (query || (messages.length > 0 ? messages[messages.length - 1].text : '')).trim();

    // 0. Primary Delegation: Call Flixora-Server Express + MongoDB Backend Endpoint
    try {
      const serverRes = await fetch(`${SERVER_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, query: userMessage, sessionId, userId, messages }),
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.success && serverData.reply) {
          return NextResponse.json(serverData);
        }
      }
    } catch (serverErr) {
      console.warn('Backend server call failed, executing client-side AI fallback engine:', serverErr);
    }

    const qLower = userMessage.toLowerCase();

    // Parse requested count (e.g. "suggest 5 movies" -> 5)
    const countMatch = qLower.match(/\b([1-9]|10)\b/);
    const requestedCount = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 10) : 6;

    // Helper function to extract TMDB movies array with dynamic count (supports movies, anime & TV shows)
    const extractMovies = (results: any[], count: number = 6) => {
      return (results || [])
        .filter((m: any) => m.media_type !== 'person')
        .slice(0, count)
        .map((m: any) => {
          const itemTitle = m.title || m.name || 'Featured Title';
          const itemDate = m.release_date || m.first_air_date;
          return {
            id: m.id.toString(),
            title: itemTitle,
            original_title: m.original_title || m.original_name,
            year: itemDate ? new Date(itemDate).getFullYear() : 2026,
            rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
            genres: m.genre_ids || ['Featured'],
            posterUrl: getTMDBImageUrl(m.poster_path, 'w500'),
            poster_path: m.poster_path ? getTMDBImageUrl(m.poster_path, 'w500') : null,
            backdrop_path: m.backdrop_path ? getTMDBImageUrl(m.backdrop_path, 'original') : null,
            overview: m.overview || '',
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            release_date: m.release_date || m.first_air_date,
            media_type: m.media_type || 'movie',
          };
        });
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

    // Helper function to extract target for summary queries ("summary about solo leveling")
    const extractSummaryTarget = (msg: string): string | null => {
      const q = msg.toLowerCase().trim();
      const isSummary = /(?:summary|synopsis|overview|plot|details?|info|explain|tell\s+me\s+about|what\s+is\s+.+\s+about)\b/i.test(q);
      if (!isSummary) return null;

      const p1 = q.match(/(?:summary|synopsis|overview|plot|details?|info|explain|tell\s+me)\s+(?:about|of|for|on)?\s+([^,.?!]+)/i);
      if (p1 && p1[1]) {
        let candidate = p1[1].replace(/\b(please|can\s+you|could\s+you|movie|anime|show|series)\b/gi, '').trim();
        if (candidate && candidate.length >= 2) return candidate;
      }

      const p2 = q.match(/what\s+is\s+([^,.?!]+?)\s+about/i);
      if (p2 && p2[1]) {
        let candidate = p2[1].replace(/\b(movie|anime|show|series)\b/gi, '').trim();
        if (candidate && candidate.length >= 2) return candidate;
      }

      return null;
    };

    const summaryTarget = extractSummaryTarget(userMessage);

    // 2. Summary & Overview Intent ("can you give me a summary about solo leveling")
    if (summaryTarget) {
      try {
        const multiRes = await fetchFromTMDB<any>(`/search/multi?query=${encodeURIComponent(summaryTarget)}&language=en-US&page=1`).catch(() => null);
        const target = (multiRes?.results || []).find((r: any) => r.media_type === 'movie' || r.media_type === 'tv');

        if (target) {
          const title = target.title || target.name;
          const dateStr = target.release_date || target.first_air_date;
          const yearStr = dateStr ? ` (${new Date(dateStr).getFullYear()})` : '';
          const ratingStr = target.vote_average ? `${Number(target.vote_average.toFixed(1))}/10` : '8.0/10';
          const isAnime = (target.origin_country || []).includes('JP') || (target.genre_ids || []).includes(16);
          const mediaType = target.media_type === 'tv' ? (isAnime ? 'Anime / TV Series' : 'TV Series') : 'Movie';

          const textLines = [
            `📖 **Summary & Overview: "${title}"${yearStr}**\n`,
            `🎬 **Type**: ${mediaType} | ⭐ **Rating**: ${ratingStr}\n`,
            `**Synopsis**:`,
            `${target.overview || 'No detailed synopsis available.'}\n`,
            `🍿 *Would you like recommendations similar to ${title}?*`
          ];

          const card = [{
            id: target.id.toString(),
            title: title,
            year: dateStr ? new Date(dateStr).getFullYear() : 2026,
            rating: target.vote_average ? Number(target.vote_average.toFixed(1)) : 8.0,
            genres: [mediaType],
            posterUrl: getTMDBImageUrl(target.poster_path, 'w500'),
            overview: target.overview || '',
          }];

          return NextResponse.json({
            success: true,
            reply: textLines.join('\n'),
            movies: card,
            source: 'tmdb_summary',
          });
        }
      } catch (sumErr) {
        console.warn('Summary API error, falling back to standard intent:', sumErr);
      }
    }

    // Helper function to extract target movie title for similarity queries ("movies like Inception")
    const extractTargetMovie = (msg: string): string | null => {
      const q = msg.toLowerCase().trim();

      // Check for similarity intent keywords
      const isSimilarIntent = /(?:like|similar\s+to|resembling|related\s+to|same\s+as|liked|loved|enjoyed)\b/i.test(q);
      if (!isSimilarIntent) return null;

      // Pattern 1: "movies like Inception", "suggest 5 movies like Interstellar", "something like Fight Club"
      const likeMatch = q.match(/(?:movies|films|shows|something|anything|suggest|recommend|give\s+me|find)?\s*(?:like|similar\s+to|resembling|related\s+to|same\s+as)\s+([^,.?!]+)/i);
      if (likeMatch && likeMatch[1]) {
        let candidate = likeMatch[1].split(/\b(what|how|where|suggest|give|show|recommend)\b/i)[0];
        candidate = candidate.replace(/\b(movies|films|shows|please|suggest|recommend|top|[0-9]+|this|that|like\s+that)\b/gi, '').trim();
        if (candidate && candidate !== 'this' && candidate !== 'that' && candidate.length >= 2) {
          return candidate;
        }
      }

      // Pattern 2: "i loved Dune, give me movies like that", "if i liked Avengers", "i enjoyed Oppenheimer"
      const likedMatch = q.match(/(?:if\s+i\s+|i\s+)(?:liked|loved|enjoyed|watched)\s+([^,.?!]+)/i);
      if (likedMatch && likedMatch[1]) {
        let candidate = likedMatch[1].split(/\b(what|how|where|suggest|give|show|recommend)\b/i)[0];
        candidate = candidate.replace(/\b(give|suggest|show|recommend|movies|films|like|that|this|more)\b/gi, '').trim();
        if (candidate && candidate.length >= 2) {
          return candidate;
        }
      }

      return null;
    };

    const targetMovieTitle = extractTargetMovie(userMessage);

    // 2. Movie Similarity / Recommendations Intent ("movies like Inception")
    if (targetMovieTitle) {
      try {
        const searchData = await fetchFromTMDB<any>(`/search/movie?query=${encodeURIComponent(targetMovieTitle)}&language=en-US&page=1`).catch(() => null);
        const targetMovie = searchData?.results?.[0];

        if (targetMovie) {
          // Fetch algorithmic recommendations tag graph from TMDB
          let recData = await fetchFromTMDB<any>(`/movie/${targetMovie.id}/recommendations?language=en-US&page=1`).catch(() => null);
          if (!recData?.results?.length) {
            recData = await fetchFromTMDB<any>(`/movie/${targetMovie.id}/similar?language=en-US&page=1`).catch(() => null);
          }

          if (recData?.results?.length > 0) {
            const movies = extractMovies(recData.results, requestedCount);
            const yearStr = targetMovie.release_date ? ` (${new Date(targetMovie.release_date).getFullYear()})` : '';

            const lines = [
              `🎬 **Movies Similar to "${targetMovie.title}"${yearStr}:**\n*Based on genre tags, storyline themes, and recommendations related to ${targetMovie.title}:*\n`
            ];
            movies.forEach((m, idx) => {
              const mYear = m.year ? ` (${m.year})` : '';
              const mRating = m.rating ? ` ⭐ ${m.rating}` : '';
              const mDesc = m.overview ? ` — *${m.overview.slice(0, 70)}...*` : '';
              lines.push(`${idx + 1}. **${m.title}**${mYear}${mRating}${mDesc}`);
            });

            return NextResponse.json({
              success: true,
              reply: lines.join('\n'),
              movies,
              source: 'tmdb_similarity',
            });
          }
        }
      } catch (simErr) {
        console.warn('Similarity API error, falling back to standard intent:', simErr);
      }
    }

    // Flexible Genre and Movie Intent handling with TMDB rich cards
    let tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
    let categoryName = 'Popular';
    let emojiHeader = '🍿';

    if (/sci[- ]?fi|science\s*fiction|scifi|space|alien|futuristic|cyberpunk/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=878&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Sci-Fi';
      emojiHeader = '🚀';
    } else if (/action|fight|superhero|explosive|martial\s*arts/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=28&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Action';
      emojiHeader = '⚡️';
    } else if (/adventure|journey|expedition/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=12&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Adventure';
      emojiHeader = '🗺️';
    } else if (/horror|scary|spooky|creepy|ghost|zombie|vampire|slasher/i.test(qLower)) {
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
    } else if (/thriller|suspense|mystery|detective/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=53&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Suspenseful Thriller';
      emojiHeader = '🔍';
    } else if (/crime|gangster|mafia|heist/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=80&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Crime';
      emojiHeader = '🕵️';
    } else if (/romance|romantic|love\s*movie|date\s*night/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=10749&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Romantic';
      emojiHeader = '❤️';
    } else if (/drama|emotional/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=18&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Drama';
      emojiHeader = '🎭';
    } else if (/fantasy|magic|mythical/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=14&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Fantasy';
      emojiHeader = '⚔️';
    } else if (/family|kids|children/i.test(qLower)) {
      tmdbEndpoint = '/discover/movie?with_genres=10751&sort_by=popularity.desc&language=en-US&page=1';
      categoryName = 'Family & Kids';
      emojiHeader = '👨‍👩‍👧‍👦';
    } else if (/trending|popular|hits|top\s*rated|blockbuster/i.test(qLower)) {
      tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
      categoryName = 'Trending Blockbuster';
      emojiHeader = '🔥';
    } else if (/recommend|suggest|what\s*(should|to)\s*watch|movie\s*night|good\s*movie/i.test(qLower)) {
      tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
      categoryName = 'Movie Night';
      emojiHeader = '🍿';
    } else if (userMessage) {
      tmdbEndpoint = `/search/multi?query=${encodeURIComponent(userMessage)}&language=en-US&page=1`;
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
