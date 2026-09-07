'use client';

import React, { useEffect, useState, use } from 'react';
import { Loader2, Film, ArrowLeft, LogIn, UserPlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/app/(auth)/lib/auth-client';
import ShareablePlaylistView from '@/components/playlist/ShareablePlaylistView';
import { PlaylistItem } from '@/components/playlist/PlaylistCard';

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicPlaylistPage({ params }: PlaylistPageProps) {
  const { id } = use(params);
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [playlist, setPlaylist] = useState<PlaylistItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/playlist?id=${id}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.playlist) {
        setError(data.message || 'Playlist not found');
        setPlaylist(null);
      } else {
        setPlaylist(data.playlist);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && session?.user?.id) {
      fetchPlaylist();
    } else if (id && !sessionLoading && !session?.user?.id) {
      // User is not logged in: we still fetch metadata if public to show preview title on login screen
      fetchPlaylist();
    }
  }, [id, session?.user?.id, sessionLoading]);

  const handleRemoveMovie = async (movieId: string) => {
    if (!playlist) return;
    try {
      const res = await fetch('/api/playlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeMovie',
          playlistId: playlist._id,
          movieId,
        }),
      });
      const data = await res.json();
      if (data.success && data.playlist) {
        setPlaylist(data.playlist);
      }
    } catch (err) {
      console.error('Failed to remove movie:', err);
    }
  };

  if (sessionLoading || (loading && !error && !playlist)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#FF4C00]" />
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Loading Playlist...
        </span>
      </div>
    );
  }

  // 1. Unauthenticated barrier: user MUST be logged in to view and save
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center gap-6 relative select-none overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4C00]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-[#FF4C00]/10 border border-[#FF4C00]/30 flex items-center justify-center text-[#FF4C00] shadow-[0_0_40px_rgba(255,76,0,0.2)]">
          <Film size={32} />
        </div>

        <div className="flex flex-col gap-2.5 max-w-md relative z-10">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 text-[#FF4C00] text-[10px] font-black uppercase tracking-widest mx-auto">
            <Sparkles size={12} />
            <span>Shared Playlist Invitation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            {playlist?.name ? `"${playlist.name}"` : 'Curated Cinema Playlist'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed mt-1">
            You've been invited to explore this cinema collection. Please log in or create an account with Flixora to view all titles and save this playlist directly to your dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 mt-2">
          <Link
            href={`/auth/login?callbackUrl=/playlist/${id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#FF4C00]/20 cursor-pointer whitespace-nowrap"
          >
            <LogIn size={15} /> Log In to Access
          </Link>
          <Link
            href={`/auth/signup?callbackUrl=/playlist/${id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1C1C1C] border border-zinc-800 hover:border-zinc-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <UserPlus size={15} /> Create Account
          </Link>
        </div>
      </div>
    );
  }

  // 2. Error or not found
  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-[#1A1A1A] flex items-center justify-center text-zinc-600">
          <Film size={32} />
        </div>
        <h1 className="text-xl font-black uppercase tracking-wider text-white">
          Playlist Not Found
        </h1>
        <p className="text-xs text-zinc-500 max-w-sm">
          This playlist may have been deleted, set to private, or the link may be invalid.
        </p>
        <Link
          href="/dashboard/my-playlist"
          className="flex items-center gap-2 bg-[#FF4C00] text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl mt-2 hover:bg-[#e04300] transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Playlists
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(playlist.isOwner ?? (session?.user?.id && playlist.userId === session.user.id));
  const isSaved = Boolean(playlist.isSaved);

  return (
    <ShareablePlaylistView
      playlist={playlist}
      isOwner={isOwner}
      isSaved={isSaved}
      onRemoveMovie={isOwner ? handleRemoveMovie : undefined}
      onToggleSaveDashboard={(saved) => {
        setPlaylist((prev) => (prev ? { ...prev, isSaved: saved } : null));
      }}
    />
  );
}
