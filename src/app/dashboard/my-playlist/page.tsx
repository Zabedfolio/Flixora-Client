'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EmptyState from '@/components/common/EmptyState';
import { 
  Sparkles, 
  Plus, 
  Film, 
  Smile, 
  Zap, 
  Heart, 
  History, 
  Compass, 
  Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PlaylistCard, { PlaylistItem } from '@/components/playlist/PlaylistCard';
import CreatePlaylistModal from '@/components/playlist/CreatePlaylistModal';
import PlaylistDetailsModal from '@/components/playlist/PlaylistDetailsModal';
import { getCachedPlaylists, fetchPlaylistsFast, subscribeToPlaylistCache } from '@/lib/playlistCache';

interface MoodCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const MOODS: MoodCategory[] = [
  { id: 'feel-good', name: 'Feel-Good', icon: Smile, description: 'Uplifting and warm stories' },
  { id: 'intense', name: 'Intense', icon: Zap, description: 'High-stakes suspense and thrillers' },
  { id: 'nostalgic', name: 'Nostalgic', icon: History, description: 'Timeless retro cinema' },
  { id: 'heartbreak', name: 'Emotional', icon: Heart, description: 'Deep romances and touching dramas' },
  { id: 'adrenaline', name: 'Adrenaline', icon: Compass, description: 'Action-packed cinematic spectacles' },
];

export default function MyPlaylistsPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const initialCache = getCachedPlaylists();
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(initialCache || []);
  const [loading, setLoading] = useState<boolean>(initialCache === null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(null);
  const [detailsPlaylist, setDetailsPlaylist] = useState<PlaylistItem | null>(null);

  // Subscribe to cache updates
  useEffect(() => {
    const unsub = subscribeToPlaylistCache((latest) => {
      setPlaylists(latest);
      setLoading(false);
      setDetailsPlaylist((prev) => {
        if (!prev) return null;
        return latest.find((p) => p._id === prev._id) || prev;
      });
    });
    return unsub;
  }, []);

  const fetchPlaylists = useCallback(async (force = false) => {
    const cached = getCachedPlaylists();
    if (!cached || force) {
      setLoading(true);
    }
    try {
      const data = await fetchPlaylistsFast(force);
      setPlaylists(data);
      setDetailsPlaylist((prev) => {
        if (!prev) return null;
        return data.find((p) => p._id === prev._id) || prev;
      });
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();

    const handleUpdate = () => {
      fetchPlaylists();
    };

    window.addEventListener('playlists-updated', handleUpdate);
    return () => {
      window.removeEventListener('playlists-updated', handleUpdate);
    };
  }, [fetchPlaylists]);

  const handleOpenCreateModal = () => {
    setEditingPlaylist(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (playlist: PlaylistItem) => {
    setEditingPlaylist(playlist);
    setIsModalOpen(true);
  };

  const handleSavePlaylist = async (data: { name: string; tag: string; description?: string }) => {
    try {
      if (editingPlaylist) {
        const res = await fetch('/api/playlist', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateDetails',
            playlistId: editingPlaylist._id,
            name: data.name,
            tag: data.tag,
            description: data.description,
          }),
        });
        const resData = await res.json();
        if (resData.success) {
          toast.success('Playlist updated successfully!');
          fetchPlaylists();
        } else {
          toast.error(resData.message || 'Failed to update playlist');
        }
      } else {
        const res = await fetch('/api/playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resData = await res.json();
        if (resData.success) {
          toast.success('Playlist created successfully!', {
            icon: <Sparkles size={16} className="text-[#FF4C00]" />,
            style: {
              background: '#0E0E0E',
              color: '#fff',
              border: '1px solid #FF4C00',
            },
          });
          fetchPlaylists();
        } else {
          toast.error(resData.message || 'Failed to create playlist');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      const res = await fetch(`/api/playlist?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Playlist deleted');
        fetchPlaylists();
      } else {
        toast.error(data.message || 'Could not delete playlist');
      }
    } catch (err) {
      toast.error('Failed to delete playlist');
    }
  };

  const filteredPlaylists = selectedMood
    ? playlists.filter((pl) => {
        const cleanTag = (pl.tag || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanMood = selectedMood.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanTag.includes(cleanMood) || pl.name.toLowerCase().includes(cleanMood);
      })
    : playlists;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-10">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-0.5 border-b border-[#1A1A1A] pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                My Playlists
              </h1>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">
              Curate and organize your cinema collections with shareable YouTube-style public links.
            </p>
          </div>
          
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl hover:scale-102 transition-all outline-none w-fit cursor-pointer shadow-lg shadow-[#FF4C00]/10"
          >
            <Plus size={16} strokeWidth={3} />
            Create Playlist
          </button>
        </div>

        {/* SECTION 1: QUICK MOOD CURATION */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
              Curated Vibes
            </h2>
            {selectedMood && (
              <button
                onClick={() => setSelectedMood(null)}
                className="text-xs font-semibold text-[#FF4C00] hover:underline cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2 scroll-smooth">
            {MOODS.map((mood) => {
              const MoodIcon = mood.icon;
              const isSelected = selectedMood === mood.id;

              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(isSelected ? null : mood.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-200 shrink-0 outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#FF4C00] text-white shadow-[0_0_20px_rgba(255,76,0,0.15)] font-bold'
                      : 'bg-[#0E0E0E] border-[#1A1A1A] text-zinc-400 hover:text-white hover:border-zinc-800'
                  }`}
                >
                  <MoodIcon size={16} className={isSelected ? 'text-[#FF4C00]' : ''} />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider">{mood.name}</span>
                    <span className="text-[9px] text-zinc-500 font-normal">{mood.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: YOUR PLAYLISTS (CONNECTED TO MONGODB) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
              Your Collections ({filteredPlaylists.length})
              {selectedMood && (
                <span className="ml-2 text-xs text-[#FF4C00] font-normal lowercase">
                  — showing {selectedMood}
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
              <Loader2 size={28} className="animate-spin text-[#FF4C00]" />
              <span className="text-xs font-bold uppercase tracking-wider">Loading Collections...</span>
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <EmptyState 
              title={selectedMood ? `No "${selectedMood}" Playlists` : "No Playlists Yet"}
              description={selectedMood ? `You don't have any playlists tagged with "${selectedMood}".` : "Build your first custom playlist with your favorite films or randomize a theme to get started."}
              icon={Film}
              actionText={selectedMood ? "Show All Playlists" : "Create Playlist"}
              onActionClick={() => selectedMood ? setSelectedMood(null) : handleOpenCreateModal()}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* "+ Create New" Card Tile */}
              <button 
                onClick={handleOpenCreateModal}
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#FF4C00]/30 hover:border-[#FF4C00] bg-[#0E0E0E]/40 hover:bg-[#FF4C00]/5 text-zinc-400 hover:text-white rounded-2xl p-6 h-full min-h-[220px] transition-all duration-300 outline-none cursor-pointer group shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-[#FF4C00] group-hover:scale-110 transition-transform mb-3">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white">Create New</span>
                <span className="text-[10px] text-zinc-500 font-semibold mt-1">With Shareable Link</span>
              </button>

              {/* Real Playlist Cards */}
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  onDelete={handleDeletePlaylist}
                  onEdit={handleOpenEditModal}
                  onViewDetails={(pl) => setDetailsPlaylist(pl)}
                />
              ))}

            </div>
          )}
        </section>

      </main>

      {/* CREATE / EDIT PLAYLIST MODAL COMPONENT */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlaylist}
        initialData={editingPlaylist ? {
          name: editingPlaylist.name,
          tag: editingPlaylist.tag,
          description: editingPlaylist.description,
        } : null}
        isEditing={Boolean(editingPlaylist)}
      />

      {/* PLAYLIST DETAILS MODAL COMPONENT */}
      <PlaylistDetailsModal
        isOpen={Boolean(detailsPlaylist)}
        onClose={() => setDetailsPlaylist(null)}
        playlist={detailsPlaylist}
        onPlaylistUpdated={fetchPlaylists}
      />
    </div>
  );
}
