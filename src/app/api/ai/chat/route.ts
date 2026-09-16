import { NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';

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
        reply: "Hi! I'm Flix, your AI movie companion. Tell me what genre, mood, language, actor, or movie title you are looking for!",
      });
    }

    // 1. Conversational Intent & Greetings Check FIRST
    const isGreeting = /^(hi|hello|hey|hy|hola|sup|yo|good\s*(morning|afternoon|evening|night)|howdy|heyy+)\b/i.test(qLower);
    const isIdentity = /(who are you|what is your name|what can you do|who made you|help|capabilities|what is flix)\b/i.test(qLower);
    const isGratitude = /(thanks|thank\s*you|thx|awesome|cool|great|sweet|perfect|appreciate)\b/i.test(qLower);
    const isFarewell = /(bye|goodbye|cya|see\s*ya|night|gn)\b/i.test(qLower);
    const isWatchlist = /(watchlist|save|download|subscription|payment|account|profile)\b/i.test(qLower);

    if (isGreeting) {
      return NextResponse.json({
        success: true,
        reply: "Hey there! I'm Flix, your AI cinema guide on Flixora.\n\nWhat kind of movie or TV show are you in the mood for today? Ask me for genre suggestions (Horror, Comedy, Action, Bangla), movies similar to your favorites, or popular blockbusters!",
        source: 'ai_engine'
      });
    }

    if (isIdentity) {
      return NextResponse.json({
        success: true,
        reply: "I'm **Flix**, Flixora's intelligent AI streaming assistant!\n\nHere is how I can help you today:\n• Find movie & TV show recommendations by genre, language, mood, or actor\n• Search for movies similar to your favorites\n• Provide detailed plot summaries & ratings\n• Filter by decade, runtime, or date night picks",
        source: 'ai_engine'
      });
    }

    if (isGratitude) {
      return NextResponse.json({
        success: true,
        reply: "You're very welcome! Let me know whenever you're ready for your next movie night. Enjoy streaming on Flixora!",
        source: 'ai_engine'
      });
    }

    if (isFarewell) {
      return NextResponse.json({
        success: true,
        reply: "Goodbye! Have an awesome movie night! Come back anytime you need great recommendations!",
        source: 'ai_engine'
      });
    }

    if (isWatchlist) {
      return NextResponse.json({
        success: true,
        reply: "FLIXORA WATCHLIST GUIDE:\n\nTo save any movie to your collection, click the '+ Add to Watchlist' button on any movie card or detail page. You can access your saved titles anytime from your User Dashboard!",
        source: 'ai_engine'
      });
    }

    // 2. Negative Preference / Dislike Intent Check ("I do not like odessey type movie", "I don't like horror")
    const negativeMatch = qLower.match(/(?:do\s*n['’]?t\s+like|do\s+not\s+like|dislike|hate|avoid|not\s+a\s+fan\s+of|no\s+more|stop\s+showing|don['’]?t\s+want|do\s+not\s+want)\s+([^,.?!]+)/i);

    if (negativeMatch && negativeMatch[1]) {
      const dislikedPhrase = negativeMatch[1].trim();

      let dislikedName = "that type of";

      if (/\b(odyssey|odessey|space|sci-?fi|science\s*fiction|alien|futuristic)\b/i.test(dislikedPhrase)) {
        dislikedName = "Odyssey & Space Sci-Fi";
      } else if (/\b(horror|scary|ghost|spooky|zombie|slasher|creepy)\b/i.test(dislikedPhrase)) {
        dislikedName = "Horror & Scary";
      } else if (/\b(funny|comedy|comedies|humor)\b/i.test(dislikedPhrase)) {
        dislikedName = "Comedy";
      } else if (/\b(action|fight|combat)\b/i.test(dislikedPhrase)) {
        dislikedName = "Action";
      } else if (/\b(romance|romantic|love)\b/i.test(dislikedPhrase)) {
        dislikedName = "Romance";
      } else if (/\b(crime|gangster|mafia)\b/i.test(dislikedPhrase)) {
        dislikedName = "Crime";
      } else if (/\b(drama|emotional)\b/i.test(dislikedPhrase)) {
        dislikedName = "Drama";
      } else {
        const cleanedName = dislikedPhrase.replace(/\b(movie|movies|type|films?|shows?)\b/gi, '').trim();
        dislikedName = cleanedName ? `"${cleanedName}"` : "that type of";
      }

      const hasPositiveGenre = /(funny|comedy|action|bangla|hindi|korean|anime|scifi|sci-fi|romance|crime|drama|adventure|family)/i.test(qLower.replace(negativeMatch[0], ''));

      if (!hasPositiveGenre) {
        const allOptions = [
          "Funny Comedy",
          "Action",
          "Bangla",
          "Sci-Fi",
          "Romantic",
          "Crime",
          "Drama",
          "Trending Blockbusters"
        ];
        const filteredOptions = allOptions.filter(
          (opt) => !opt.toLowerCase().includes(dislikedName.toLowerCase().split(' ')[0])
        );

        return NextResponse.json({
          success: true,
          reply: `Understood! I will avoid **${dislikedName}** movies for you.\n\nWhat genres or types of movies do you prefer instead? Select an option below or type your preference:`,
          options: filteredOptions,
          source: 'ai_negative_preference',
        });
      }
    }

    // Parse requested count (e.g. "suggest 5 movies" -> 5)
    let countMatch = qLower.match(/\b([1-9]|10)\b/);
    if (!countMatch && messages.length >= 2) {
      const prevMsg = messages[messages.length - 2]?.text?.toLowerCase() || '';
      countMatch = prevMsg.match(/\b([1-9]|10)\b/);
    }
    const requestedCount = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 10) : 6;

    // Helper function to extract TMDB movies array with STRICT dynamic count
    const extractMovies = (results: any[], count: number = 6) => {
      return (results || [])
        .filter((m: any) => m.media_type !== 'person' && (m.poster_path || m.backdrop_path))
        .slice(0, count)
        .map((m: any) => {
          const itemTitle = m.title || m.name || 'Featured Title';
          const itemDate = m.release_date || m.first_air_date;
          const poster = m.poster_path || m.backdrop_path;
          return {
            id: m.id.toString(),
            title: itemTitle,
            original_title: m.original_title || m.original_name,
            year: itemDate ? new Date(itemDate).getFullYear() : 2026,
            rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
            genres: m.genre_ids || ['Featured'],
            posterUrl: getTMDBImageUrl(poster, 'w500'),
            poster_path: poster ? getTMDBImageUrl(poster, 'w500') : null,
            backdrop_path: m.backdrop_path ? getTMDBImageUrl(m.backdrop_path, 'original') : null,
            overview: m.overview || '',
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            release_date: m.release_date || m.first_air_date,
            media_type: m.media_type || 'movie',
          };
        });
    };

    // Helper to build clean AI text response listing items
    const buildAIReply = (category: string, moviesList: any[]) => {
      if (!moviesList || moviesList.length === 0) {
        return `Here are top ${category} movies for you on Flixora:`;
      }
      const lines = [
        `Here are ${moviesList.length} top ${category} recommendations for your movie night:\n`
      ];
      moviesList.forEach((m, idx) => {
        const yearStr = m.year ? ` (${m.year})` : '';
        const ratingStr = m.rating ? ` [Rating: ${m.rating}]` : '';
        const descStr = m.overview ? ` — *${m.overview.slice(0, 75)}...*` : '';
        lines.push(`${idx + 1}. **${m.title}**${yearStr}${ratingStr}${descStr}`);
      });
      return lines.join('\n');
    };

    // 3. Ambiguous Query Interception (Asking User Clarification with Interactive Option Buttons)
    const hasCategorySignal = /(horror|funny|comedy|action|bangla|hindi|korean|anime|scifi|sci-fi|thriller|romance|crime|drama|family|adventure|like|starring|actor|actress|directed|90s|80s|2024|2023|top\s*rated|best|sad|depressed|bored|relaxing|chill|date\s*night|time\s*travel|heist|zombie|mind-?bending)/i.test(qLower);
    const isGenericRecommendation = (/^(suggest|recommend|give|show|find|get)\s*([1-9]|10)?\s*(movies?|films?|shows?|series?|something)?$/i.test(qLower) ||
      (/^(suggest|recommend|give)\s*([1-9]|10)\b/i.test(qLower) && !hasCategorySignal));

    if (isGenericRecommendation) {
      return NextResponse.json({
        success: true,
        reply: `What type of movies or mood are you looking for${countMatch ? ` (${requestedCount} movies)` : ''}? Choose a genre below or type your preference:`,
        options: [
          "Funny Comedy",
          "Action",
          "Bangla",
          "Sci-Fi",
          "Romantic",
          "Crime",
          "Trending Blockbusters"
        ],
        requestedCount,
        source: 'ai_clarification',
      });
    }

    // 4. Actor / Director / Cast Query Intent ("movies starring Leonardo DiCaprio", "movies by Christopher Nolan")
    const extractPersonTarget = (msg: string): string | null => {
      const q = msg.toLowerCase().trim();
      const personMatch = q.match(/(?:movies?\s+starring|movies?\s+with|actor|actress|directed\s+by|director|films?\s+with)\s+([^,.?!]+)/i);
      if (personMatch && personMatch[1]) {
        let candidate = personMatch[1].replace(/\b(please|suggest|recommend|show|give|movies|films)\b/gi, '').trim();
        if (candidate && candidate.length >= 2) return candidate;
      }
      return null;
    };

    const personTarget = extractPersonTarget(userMessage);
    if (personTarget) {
      try {
        const personSearch = await fetchFromTMDB<any>(`/search/person?query=${encodeURIComponent(personTarget)}&language=en-US&page=1`).catch(() => null);
        const person = personSearch?.results?.[0];

        if (person) {
          const credits = await fetchFromTMDB<any>(`/person/${person.id}/movie_credits?language=en-US`).catch(() => null);
          const castMovies = (credits?.cast || []).sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));

          if (castMovies.length > 0) {
            const movies = extractMovies(castMovies, requestedCount);
            const lines = [
              `Top Movies Featuring **${person.name}**:\n`
            ];
            movies.forEach((m, idx) => {
              const yearStr = m.year ? ` (${m.year})` : '';
              const ratingStr = m.rating ? ` [Rating: ${m.rating}]` : '';
              const descStr = m.overview ? ` — *${m.overview.slice(0, 75)}...*` : '';
              lines.push(`${idx + 1}. **${m.title}**${yearStr}${ratingStr}${descStr}`);
            });

            return NextResponse.json({
              success: true,
              reply: lines.join('\n'),
              movies,
              source: 'tmdb_person',
            });
          }
        }
      } catch (personErr) {
        console.warn('Person search API error:', personErr);
      }
    }

    // 5. Movie Summary & Overview Intent ("summary about solo leveling")
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
            `**Summary & Overview: "${title}"${yearStr}**\n`,
            `Rating: ${ratingStr}\n`,
            `**Synopsis**:`,
            `${target.overview || 'No detailed synopsis available.'}\n`,
            `Enjoy watching ${title} on Flixora!`
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

    // 6. Movie Similarity Search Intent ("movies like Inception")
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
              `Movies Similar to **"${targetMovie.title}"**${yearStr}:\n`
            ];
            movies.forEach((m, idx) => {
              const mYear = m.year ? ` (${m.year})` : '';
              const mRating = m.rating ? ` [Rating: ${m.rating}]` : '';
              const mDesc = m.overview ? ` — *${m.overview.slice(0, 75)}...*` : '';
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

    // 7. Comprehensive Category, Genre, Language, Mood, Occasion & Runtime Resolver
    const categoryInfo = resolveCategorySearch(userMessage);
    let tmdbData = await fetchFromTMDB<any>(categoryInfo.endpoint).catch(() => ({ results: [] }));

    if (!tmdbData?.results?.length && userMessage) {
      tmdbData = await fetchFromTMDB<any>('/trending/movie/day?language=en-US&page=1').catch(() => ({ results: [] }));
      categoryInfo.name = 'Trending Blockbuster';
    }

    const movies = extractMovies(tmdbData?.results, requestedCount);
    const replyText = buildAIReply(categoryInfo.name, movies);

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
      reply: "Hey! I'm Flix, your AI movie guide! Ask me for genre suggestions (Horror, Comedy, Bangla, Action) or any movie title to get recommendations!",
    });
  }
}

// Category & Intent Resolver Helper
function resolveCategorySearch(userQuery: string) {
  const qLower = userQuery.toLowerCase().trim();

  // 1. Language & Regional Categories
  let langParam = '';
  let langName = '';

  if (/\b(bangla|bengali|bangladesh|bd\s*movies?|kolkata|dhallywood)\b/i.test(qLower)) {
    langParam = 'with_original_language=bn';
    langName = 'Bangla';
  } else if (/\b(hindi|bollywood|indian\s*movies?|india)\b/i.test(qLower)) {
    langParam = 'with_original_language=hi';
    langName = 'Hindi / Bollywood';
  } else if (/\b(korean|k-drama|kdrama|korea|seoul)\b/i.test(qLower)) {
    langParam = 'with_original_language=ko';
    langName = 'Korean';
  } else if (/\b(japanese|japan)\b/i.test(qLower)) {
    langParam = 'with_original_language=ja';
    langName = 'Japanese';
  } else if (/\b(spanish|spain|latino)\b/i.test(qLower)) {
    langParam = 'with_original_language=es';
    langName = 'Spanish';
  } else if (/\b(french|france)\b/i.test(qLower)) {
    langParam = 'with_original_language=fr';
    langName = 'French';
  }

  // 2. Genre Categories
  let genreParam = '';
  let genreName = '';

  if (/\b(horror|scary|spooky|ghost|creepy|zombie|vampire|slasher|haunted|frightening|scariest)\b/i.test(qLower)) {
    genreParam = 'with_genres=27';
    genreName = 'Horror';
  } else if (/\b(funny|comedy|comedies|hilarious|laugh|humor|fun|amusing|joke)\b/i.test(qLower)) {
    genreParam = 'with_genres=35';
    genreName = 'Funny Comedy';
  } else if (/\b(action|fight|superhero|explosive|combat|martial\s*arts|gunfight|stunt)\b/i.test(qLower)) {
    genreParam = 'with_genres=28';
    genreName = 'Action';
  } else if (/\b(anime|animation|animated|cartoon|manga|otaku)\b/i.test(qLower)) {
    genreParam = 'with_genres=16';
    genreName = 'Animation & Anime';
  } else if (/\b(romance|romantic|love|couple|date\s*night|heartwarming)\b/i.test(qLower)) {
    genreParam = 'with_genres=10749';
    genreName = 'Romantic';
  } else if (/\b(sci-?fi|science\s*fiction|space|alien|futuristic|cyberpunk|time\s*travel)\b/i.test(qLower)) {
    genreParam = 'with_genres=878';
    genreName = 'Sci-Fi';
  } else if (/\b(thriller|suspense|mystery|detective|mind-?bending|twist)\b/i.test(qLower)) {
    genreParam = 'with_genres=53';
    genreName = 'Suspenseful Thriller';
  } else if (/\b(crime|gangster|mafia|heist|robbery|cop|police)\b/i.test(qLower)) {
    genreParam = 'with_genres=80';
    genreName = 'Crime';
  } else if (/\b(drama|emotional|tears|moving|biopic|true\s*story)\b/i.test(qLower)) {
    genreParam = 'with_genres=18';
    genreName = 'Drama';
  } else if (/\b(family|kids|children|disney|pixar|all\s*ages)\b/i.test(qLower)) {
    genreParam = 'with_genres=10751';
    genreName = 'Family & Kids';
  } else if (/\b(adventure|journey|expedition|exploration|treasure)\b/i.test(qLower)) {
    genreParam = 'with_genres=12';
    genreName = 'Adventure';
  }

  // 3. Emotion & Mood Intent
  let moodParam = '';
  let moodName = '';
  if (/\b(sad|depressed|unhappy|heartbroken|lonely|down)\b/i.test(qLower)) {
    moodParam = 'with_genres=35,10749';
    moodName = 'Feel-Good & Uplifting';
  } else if (/\b(bored|boredom|thrill|thrilling|exciting|hype|adrenalin)\b/i.test(qLower)) {
    moodParam = 'with_genres=28,53';
    moodName = 'High-Octane Excitement';
  } else if (/\b(relaxing|chill|comfort|calm|peaceful|late\s*night)\b/i.test(qLower)) {
    moodParam = 'with_genres=35,16';
    moodName = 'Chill & Comforting';
  }

  // 4. Occasion & Social Context Intent
  let occasionParam = '';
  let occasionName = '';
  if (/\b(date\s*night|couple|partner|rom-com)\b/i.test(qLower)) {
    occasionParam = 'with_genres=10749,35';
    occasionName = 'Date Night';
  } else if (/\b(family\s*night|family|kids|children|sleepover)\b/i.test(qLower)) {
    occasionParam = 'with_genres=10751,16';
    occasionName = 'Family Movie Night';
  }

  // 5. Specific Sub-genre Tropes & Themes
  let tropeParam = '';
  let tropeName = '';
  if (/\b(mind-?bending|plot\s*twist|twist|mind\s*fuck)\b/i.test(qLower)) {
    tropeParam = 'with_genres=53,9648&sort_by=vote_average.desc&vote_count.gte=300';
    tropeName = 'Mind-Bending Mystery';
  } else if (/\b(time\s*travel|timeline)\b/i.test(qLower)) {
    tropeParam = 'with_genres=878';
    tropeName = 'Time Travel Sci-Fi';
  } else if (/\b(heist|robbery|bank\s*robbery)\b/i.test(qLower)) {
    tropeParam = 'with_genres=80,53';
    tropeName = 'High-Stakes Heist';
  } else if (/\b(zombie|apocalypse|undead)\b/i.test(qLower)) {
    tropeParam = 'with_genres=27,28';
    tropeName = 'Zombie & Survival';
  }

  // 6. Runtime & Duration Filters
  let runtimeParam = '';
  if (/\b(short|quick|under\s*90|under\s*1\.5\s*hours?|brief)\b/i.test(qLower)) {
    runtimeParam = 'with_runtime.lte=95';
  } else if (/\b(long|epic|over\s*2\s*hours?|marathon)\b/i.test(qLower)) {
    runtimeParam = 'with_runtime.gte=135';
  }

  // 7. Decade / Year Filters
  let decadeParam = '';
  let decadeName = '';
  if (/\b(90s|nineties)\b/i.test(qLower)) {
    decadeParam = 'primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31';
    decadeName = '90s Classic';
  } else if (/\b(80s|eighties)\b/i.test(qLower)) {
    decadeParam = 'primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31';
    decadeName = '80s Retro';
  } else if (/\b(2024|2023|latest|recent)\b/i.test(qLower)) {
    decadeParam = 'primary_release_date.gte=2023-01-01';
    decadeName = 'Recent Blockbuster';
  }

  // 8. Rating / Top Rated Filter
  let ratingParam = '';
  if (/\b(top\s*rated|best|highest\s*rated)\b/i.test(qLower)) {
    ratingParam = 'sort_by=vote_average.desc&vote_count.gte=500';
  }

  // Combined active params
  const activeParams = [langParam, genreParam, moodParam, occasionParam, tropeParam, decadeParam, ratingParam, runtimeParam].filter(Boolean);
  if (activeParams.length > 0) {
    const nameStr = [langName, genreName, moodName, occasionName, tropeName, decadeName].filter(Boolean).join(' ');
    const sortStr = ratingParam ? '' : '&sort_by=popularity.desc';

    return {
      endpoint: `/discover/movie?${activeParams.join('&')}${sortStr}&language=en-US&page=1`,
      name: `${nameStr || 'Recommended'}`,
    };
  }

  // Trending / Popular
  if (/\b(trending|popular|hits|blockbusters?)\b/i.test(qLower)) {
    return {
      endpoint: '/trending/movie/day?language=en-US&page=1',
      name: 'Trending Blockbuster',
    };
  }

  // Title / Multi Search Query
  const cleanTitle = userQuery
    .replace(/\b(searching|search|show|find|give|suggest|recommend|movies?|films?|shows?|please|for|me|can\s+you|what\s+are)\b/gi, '')
    .trim() || userQuery;

  return {
    endpoint: `/search/multi?query=${encodeURIComponent(cleanTitle)}&language=en-US&page=1`,
    name: `"${cleanTitle}"`,
  };
}
