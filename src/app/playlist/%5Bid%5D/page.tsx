'use client';

import React, { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { Loader2, Film, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/app/(auth)/lib/auth-client';
import ShareablePlaylistView from '@/components/playlist/ShareablePlaylistView';
import { PlaylistItem } from '@/components/playlist/PlaylistCard';

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicPlaylistPage({ params }: PlaylistPageProps) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();

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
    if (id) {
      fetchPlaylist();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-[#FF4C00]" />
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Loading Playlist...
        </span>
      </div>
    );
  }

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

  const isOwner = Boolean(session?.user?.id && playlist.userId === session.user.id);

  return (
    <ShareablePlaylistView
      playlist={playlist}
      isOwner={isOwner}
      onRemoveMovie={isOwner ? handleRemoveMovie : undefined}
    />
  );
}
