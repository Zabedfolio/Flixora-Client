import { NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';

// Live: https://flixora-server.vercel.app
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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
    const body = await req.json().catch(() => ({}));
    const { messages = [], query = '', sessionId, userId } = body;

    const userMessage = (query || (messages.length > 0 ? messages[messages.length - 1].text : '')).trim();
    const qLower = userMessage.toLowerCase();

    if (!userMessage) {
      return NextResponse.json({
        success: true,
        reply: "Hi! 👋 I'm Flix, your AI movie companion. Tell me what genre, language, or movie title you are looking for!",
      });
    }

    // 1. Conversational Intent & Greetings Check FIRST (Prevents returning random movies for "hi")
    const isGreeting = /^(hi|hello|hey|hy|hola|sup|yo|good\s*(morning|afternoon|evening|night)|howdy|heyy+)\b/i.test(qLower);
    const isIdentity = /(who are you|what is your name|what can you do|who made you|help|capabilities|what is flix)\b/i.test(qLower);
    const isGratitude = /(thanks|thank\s*you|thx|awesome|cool|great|sweet|perfect|appreciate)\b/i.test(qLower);
    const isFarewell = /(bye|goodbye|cya|see\s*ya|night|gn)\b/i.test(qLower);
    const isWatchlist = /(watchlist|save|download|subscription|payment|account|profile)\b/i.test(qLower);

    if (isGreeting) {
      return NextResponse.json({
        success: true,
        reply: "Hey there! 👋 I'm Flix, your AI cinema guide on Flixora. 🎬\n\nWhat kind of movie or TV show are you in the mood for today? Ask me for genre suggestions (like Horror, Comedy, Action, or Bangla), movies similar to your favorites, or popular blockbusters!",
        source: 'ai_engine'
      });
    }

    if (isIdentity) {
      return NextResponse.json({
        success: true,
        reply: "I'm **Flix**, Flixora's intelligent AI streaming assistant! 🍿\n\nHere is how I can help you today:\n• 🎬 Find movie & TV show recommendations by genre or language\n• 🔍 Search for movies similar to your favorites\n• 📖 Provide detailed plot summaries & ratings\n• 🔥 Discover trending blockbusters worldwide",
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

    // Parse requested count (e.g. "suggest 5 movies" -> 5)
    const countMatch = qLower.match(/\b([1-9]|10)\b/);
    const requestedCount = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 10) : 6;

    // Helper function to extract TMDB movies array with dynamic count
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

    // 2. Try calling Kimi AI API Endpoint if key is present
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
                  'You are Flix, a warm, intelligent AI cinema companion for Flixora. Speak naturally like a movie buff.',
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
            const catSearch = resolveCategorySearch(userMessage);
            let tmdbData = await fetchFromTMDB<any>(catSearch.endpoint).catch(() => null);
            const movies = tmdbData?.results?.length ? extractMovies(tmdbData.results, requestedCount) : undefined;
            return NextResponse.json({
              success: true,
              reply: aiText,
              movies,
              source: 'kimi_ai',
            });
          }
        }
      } catch (kimiErr) {
        console.warn('Kimi API call error, using local AI cinema engine:', kimiErr);
      }
    }

    // 3. Try Delegation to Express Backend Server (for movie queries only)
    try {
      const serverRes = await fetch(`${SERVER_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, query: userMessage, sessionId, userId, messages }),
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.success && (serverData.reply || serverData.data)) {
          const reply = serverData.reply || serverData.data?.message || `Here are recommendations for "${userMessage}":`;
          const movies = serverData.movies || serverData.data?.movies || [];
          if (movies && movies.length > 0) {
            return NextResponse.json({
              success: true,
              reply,
              movies,
              source: serverData.source || 'server_express',
            });
          }
        }
      }
    } catch (serverErr) {
      console.warn('Backend server call failed, executing local AI fallback engine:', serverErr);
    }

    // 4. Movie Summary & Overview Intent ("summary about solo leveling")
    const extractSummaryTarget = (msg: string): string | null => {
      const q = msg.toLowerCase().trim();
      const isSummary = /(?:summary|synopsis|overview|plot|details?|info|explain|tell\s+me\s+about|what\s+is\s+.+\s+about)\b/i.test(q);
      if (!isSummary) return null;

      const p1 = q.match(/(?:summary|synopsis|overview|plot|details?|info|explain|tell\s+me)\s+(?:about|of|for|on)?\s+([^,.?!]+)/i);
      if (p1 && p1[1]) {
        let candidate = p1[1].replace(/\b(please|can\s+you|could\s+you|movie|anime|show|series)\b/gi, '').trim();
        if (candidate && candidate.length >= 2) return candidate;
      }
      return null;
    };

    const summaryTarget = extractSummaryTarget(userMessage);
    if (summaryTarget) {
      try {
        const multiRes = await fetchFromTMDB<any>(`/search/multi?query=${encodeURIComponent(summaryTarget)}&language=en-US&page=1`).catch(() => null);
        const target = (multiRes?.results || []).find((r: any) => r.media_type === 'movie' || r.media_type === 'tv');

        if (target) {
          const title = target.title || target.name;
          const dateStr = target.release_date || target.first_air_date;
          const yearStr = dateStr ? ` (${new Date(dateStr).getFullYear()})` : '';
          const ratingStr = target.vote_average ? `${Number(target.vote_average.toFixed(1))}/10` : '8.0/10';

          const textLines = [
            `📖 **Summary & Overview: "${title}"${yearStr}**\n`,
            `⭐ **Rating**: ${ratingStr}\n`,
            `**Synopsis**:`,
            `${target.overview || 'No detailed synopsis available.'}\n`,
            `🍿 *Enjoy watching ${title} on Flixora!*`
          ];

          const card = [{
            id: target.id.toString(),
            title: title,
            year: dateStr ? new Date(dateStr).getFullYear() : 2026,
            rating: target.vote_average ? Number(target.vote_average.toFixed(1)) : 8.0,
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
        console.warn('Summary API error:', sumErr);
      }
    }

    // 5. Movie Similarity Search Intent ("movies like Inception")
    const extractTargetMovie = (msg: string): string | null => {
      const q = msg.toLowerCase().trim();
      const isSimilarIntent = /(?:like|similar\s+to|resembling|related\s+to|same\s+as|liked|loved|enjoyed)\b/i.test(q);
      if (!isSimilarIntent) return null;

      const likeMatch = q.match(/(?:movies|films|shows|something|anything|suggest|recommend|give\s+me|find)?\s*(?:like|similar\s+to|resembling|related\s+to|same\s+as)\s+([^,.?!]+)/i);
      if (likeMatch && likeMatch[1]) {
        let candidate = likeMatch[1].split(/\b(what|how|where|suggest|give|show|recommend)\b/i)[0];
        candidate = candidate.replace(/\b(movies|films|shows|please|suggest|recommend|top|[0-9]+|this|that)\b/gi, '').trim();
        if (candidate && candidate.length >= 2) return candidate;
      }
      return null;
    };

    const targetMovieTitle = extractTargetMovie(userMessage);
    if (targetMovieTitle) {
      try {
        const searchData = await fetchFromTMDB<any>(`/search/movie?query=${encodeURIComponent(targetMovieTitle)}&language=en-US&page=1`).catch(() => null);
        const targetMovie = searchData?.results?.[0];

        if (targetMovie) {
          let recData = await fetchFromTMDB<any>(`/movie/${targetMovie.id}/recommendations?language=en-US&page=1`).catch(() => null);
          if (!recData?.results?.length) {
            recData = await fetchFromTMDB<any>(`/movie/${targetMovie.id}/similar?language=en-US&page=1`).catch(() => null);
          }

          if (recData?.results?.length > 0) {
            const movies = extractMovies(recData.results, requestedCount);
            const yearStr = targetMovie.release_date ? ` (${new Date(targetMovie.release_date).getFullYear()})` : '';

            const lines = [
              `🎬 **Movies Similar to "${targetMovie.title}"${yearStr}:**\n`
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
        console.warn('Similarity API error:', simErr);
      }
    }

    // 6. Category & Genre Search Resolver (Horror, Funny, Bangla, Action, Sci-Fi, etc.)
    const categoryInfo = resolveCategorySearch(userMessage);
    let tmdbData = await fetchFromTMDB<any>(categoryInfo.endpoint).catch(() => ({ results: [] }));

    if (!tmdbData?.results?.length && userMessage) {
      tmdbData = await fetchFromTMDB<any>('/trending/movie/day?language=en-US&page=1').catch(() => ({ results: [] }));
      categoryInfo.name = 'Trending Blockbuster';
      categoryInfo.emoji = '🎬';
    }

    const movies = extractMovies(tmdbData?.results, requestedCount);
    const replyText = buildAIReply(categoryInfo.emoji, categoryInfo.name, movies);

    return NextResponse.json({
      success: true,
      reply: replyText,
      movies: movies.length > 0 ? movies : undefined,
      source: 'local_ai_engine',
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      success: true,
      reply: "Hey! 👋 I'm Flix, your AI movie guide! Ask me for genre suggestions (Horror, Comedy, Bangla, Action) or any movie title to get recommendations!",
    });
  }
}

// Category & Intent Resolver Helper
function resolveCategorySearch(userQuery: string) {
  const qLower = userQuery.toLowerCase().trim();

  // 1. Language & Regional Categories
  let langParam = '';
  let langName = '';
  let langEmoji = '';

  if (/\b(bangla|bengali|bangladesh|bd\s*movies?|kolkata|dhallywood)\b/i.test(qLower)) {
    langParam = 'with_original_language=bn';
    langName = 'Bangla';
    langEmoji = '🇧🇩';
  } else if (/\b(hindi|bollywood|indian\s*movies?|india)\b/i.test(qLower)) {
    langParam = 'with_original_language=hi';
    langName = 'Hindi / Bollywood';
    langEmoji = '🇮🇳';
  } else if (/\b(korean|k-drama|kdrama|korea|seoul)\b/i.test(qLower)) {
    langParam = 'with_original_language=ko';
    langName = 'Korean';
    langEmoji = '🇰🇷';
  } else if (/\b(japanese|japan)\b/i.test(qLower)) {
    langParam = 'with_original_language=ja';
    langName = 'Japanese';
    langEmoji = '🇯🇵';
  } else if (/\b(spanish|spain|latino)\b/i.test(qLower)) {
    langParam = 'with_original_language=es';
    langName = 'Spanish';
    langEmoji = '🇪🇸';
  } else if (/\b(french|france)\b/i.test(qLower)) {
    langParam = 'with_original_language=fr';
    langName = 'French';
    langEmoji = '🇫🇷';
  }

  // 2. Genre Categories
  let genreParam = '';
  let genreName = '';
  let genreEmoji = '';

  if (/\b(horror|scary|spooky|ghost|creepy|zombie|vampire|slasher|haunted|frightening|scariest)\b/i.test(qLower)) {
    genreParam = 'with_genres=27';
    genreName = 'Horror';
    genreEmoji = '👻';
  } else if (/\b(funny|comedy|comedies|hilarious|laugh|humor|fun|amusing|joke)\b/i.test(qLower)) {
    genreParam = 'with_genres=35';
    genreName = 'Funny Comedy';
    genreEmoji = '😂';
  } else if (/\b(action|fight|superhero|explosive|combat|martial\s*arts|gunfight|stunt)\b/i.test(qLower)) {
    genreParam = 'with_genres=28';
    genreName = 'Action';
    genreEmoji = '⚡';
  } else if (/\b(anime|animation|animated|cartoon|manga|otaku)\b/i.test(qLower)) {
    genreParam = 'with_genres=16';
    genreName = 'Animation & Anime';
    genreEmoji = '✨';
  } else if (/\b(romance|romantic|love|couple|date\s*night|heartwarming)\b/i.test(qLower)) {
    genreParam = 'with_genres=10749';
    genreName = 'Romantic';
    genreEmoji = '❤️';
  } else if (/\b(sci-?fi|science\s*fiction|space|alien|futuristic|cyberpunk|time\s*travel)\b/i.test(qLower)) {
    genreParam = 'with_genres=878';
    genreName = 'Sci-Fi';
    genreEmoji = '🚀';
  } else if (/\b(thriller|suspense|mystery|detective|mind-?bending|twist)\b/i.test(qLower)) {
    genreParam = 'with_genres=53';
    genreName = 'Suspenseful Thriller';
    genreEmoji = '🔍';
  } else if (/\b(crime|gangster|mafia|heist|robbery|cop|police)\b/i.test(qLower)) {
    genreParam = 'with_genres=80';
    genreName = 'Crime';
    genreEmoji = '🕵️';
  } else if (/\b(drama|emotional|tears|moving|biopic|true\s*story)\b/i.test(qLower)) {
    genreParam = 'with_genres=18';
    genreName = 'Drama';
    genreEmoji = '🎭';
  } else if (/\b(family|kids|children|disney|pixar|all\s*ages)\b/i.test(qLower)) {
    genreParam = 'with_genres=10751';
    genreName = 'Family & Kids';
    genreEmoji = '👨‍👩‍👧‍👦';
  } else if (/\b(adventure|journey|expedition|exploration|treasure)\b/i.test(qLower)) {
    genreParam = 'with_genres=12';
    genreName = 'Adventure';
    genreEmoji = '🗺️';
  }

  // Combined language + genre or language-only or genre-only
  if (langParam || genreParam) {
    const params = [langParam, genreParam].filter(Boolean).join('&');
    const nameStr = [langName, genreName].filter(Boolean).join(' ');
    const emojiStr = langEmoji || genreEmoji || '🍿';

    return {
      endpoint: `/discover/movie?${params}&sort_by=popularity.desc&language=en-US&page=1`,
      name: `${nameStr}`,
      emoji: emojiStr,
    };
  }

  // Trending / Popular
  if (/\b(trending|popular|hits|top\s*rated|blockbusters?|best\s*movies?)\b/i.test(qLower)) {
    return {
      endpoint: '/trending/movie/day?language=en-US&page=1',
      name: 'Trending Blockbuster',
      emoji: '🔥',
    };
  }

  // Title / Search Query
  const cleanTitle = userQuery
    .replace(/\b(searching|search|show|find|give|suggest|recommend|movies?|films?|shows?|please|for|me|can\s+you|what\s+are)\b/gi, '')
    .trim() || userQuery;

  return {
    endpoint: `/search/multi?query=${encodeURIComponent(cleanTitle)}&language=en-US&page=1`,
    name: `"${cleanTitle}"`,
    emoji: '🎬',
  };
}
