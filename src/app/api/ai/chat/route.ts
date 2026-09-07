import { NextRequest, NextResponse } from 'next/server';
import { fetchFromTMDB, getTMDBImageUrl } from '@/data/tmdb';

const KIMI_API_KEY = process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY || 'sk-ugEIwTHItxvA5xEWPDjf89TG5O1Sq9wwv6Rqwzatx21IyTLz';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], query = '' } = body;

    const userMessage = query || (messages.length > 0 ? messages[messages.length - 1].text : '');

    // 1. Try calling Kimi / Moonshot AI API Endpoint
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
                  'You are Flix, the AI streaming assistant for Flixora. Provide concise, friendly movie & TV recommendations and cinema guidance. Keep responses helpful and under 3 paragraphs.',
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
            // Also fetch relevant TMDB movie cards for rich display
            const tmdbData = await fetchFromTMDB<any>(`/search/movie?query=${encodeURIComponent(userMessage.slice(0, 30))}&language=en-US&page=1`).catch(() => null);
            const movies = (tmdbData?.results || []).slice(0, 2).map((m: any) => ({
              id: m.id.toString(),
              title: m.title,
              year: m.release_date ? new Date(m.release_date).getFullYear() : 2026,
              rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
              genres: ['Featured'],
              posterUrl: getTMDBImageUrl(m.poster_path, 'w500'),
            }));

            return NextResponse.json({
              success: true,
              reply: aiText,
              movies: movies.length > 0 ? movies : undefined,
              source: 'kimi',
            });
          }
        }
      } catch (kimiErr) {
        console.warn('Kimi API call error, falling back to TMDB cinema intelligence:', kimiErr);
      }
    }

    // 2. Fallback Cinema Intelligence powered by live TMDB Data
    const qLower = userMessage.toLowerCase();
    let tmdbEndpoint = '/movie/popular?language=en-US&page=1';
    let replyText = `Here are some popular hits recommended for you on Flixora:`;

    if (qLower.includes('sci-fi') || qLower.includes('science fiction')) {
      tmdbEndpoint = '/discover/movie?with_genres=878&sort_by=popularity.desc&language=en-US&page=1';
      replyText = `🚀 Top recommended Sci-Fi picks streaming on Flixora:`;
    } else if (qLower.includes('action')) {
      tmdbEndpoint = '/discover/movie?with_genres=28&sort_by=popularity.desc&language=en-US&page=1';
      replyText = `⚡️ High-octane Action movies for your movie night:`;
    } else if (qLower.includes('trending') || qLower.includes('popular')) {
      tmdbEndpoint = '/trending/movie/day?language=en-US&page=1';
      replyText = `🔥 Blockbuster movies trending right now:`;
    } else if (qLower.includes('horror')) {
      tmdbEndpoint = '/discover/movie?with_genres=27&sort_by=popularity.desc&language=en-US&page=1';
      replyText = `👻 Thrilling Horror picks on Flixora:`;
    } else if (qLower.includes('comedy')) {
      tmdbEndpoint = '/discover/movie?with_genres=35&sort_by=popularity.desc&language=en-US&page=1';
      replyText = `🍿 Hilarious Comedy titles to cheer up your evening:`;
    } else if (userMessage.trim()) {
      tmdbEndpoint = `/search/movie?query=${encodeURIComponent(userMessage.trim())}&language=en-US&page=1`;
      replyText = `🎬 Found these titles matching "${userMessage}":`;
    }

    const tmdbData = await fetchFromTMDB<any>(tmdbEndpoint).catch(() => ({ results: [] }));
    const movies = (tmdbData.results || []).slice(0, 2).map((m: any) => ({
      id: m.id.toString(),
      title: m.title,
      year: m.release_date ? new Date(m.release_date).getFullYear() : 2026,
      rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
      genres: ['Featured'],
      posterUrl: getTMDBImageUrl(m.poster_path, 'w500'),
    }));

    return NextResponse.json({
      success: true,
      reply: replyText,
      movies,
      source: 'tmdb',
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      success: true,
      reply: "I'm Flix, your cinema guide! Tell me what mood or genre you want to watch tonight.",
    });
  }
}
