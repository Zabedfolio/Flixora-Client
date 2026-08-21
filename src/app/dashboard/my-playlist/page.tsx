'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  MoreVertical, 
  Search, 
  Trash2, 
  Edit3, 
  Share2, 
  Info, 
  X, 
  Music,
  Smile,
  Zap,
  Heart,
  History,
  Compass
} from 'lucide-react';

interface Title {
  id: number;
  title: string;
  type: string;
  genres: string[];
  unsplash_url: string;
}

const CATALOG_ITEMS: Title[] = [
  { id: 1, title: "Wednesday", type: "tv", genres: ["Mystery", "Comedy"], unsplash_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop" },
  { id: 2, title: "Avatar: The Way of Water", type: "movie", genres: ["Action", "Adventure"], unsplash_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop" },
  { id: 3, title: "Stranger Things", type: "tv", genres: ["Sci-Fi", "Mystery"], unsplash_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop" },
  { id: 4, title: "Demon Slayer: Kimetsu no Yaiba", type: "tv", genres: ["Animation", "Anime"], unsplash_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop" },
  { id: 5, title: "Oppenheimer", type: "movie", genres: ["Drama", "History"], unsplash_url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400&auto=format&fit=crop" },
  { id: 6, title: "Attack on Titan", type: "tv", genres: ["Animation", "Anime"], unsplash_url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop" },
  { id: 7, title: "The Last of Us", type: "tv", genres: ["Drama", "Action"], unsplash_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop" },
  { id: 8, title: "Barbie", type: "movie", genres: ["Comedy", "Fantasy"], unsplash_url: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop" }
];

const MOODS = [
  { id: 'feel-good', name: 'Feel-Good', icon: Smile, items: [1, 8] },
  { id: 'intense', name: 'Intense', icon: Zap, items: [3, 5] },
  { id: 'nostalgic', name: 'Nostalgic', icon: History, items: [2, 6] },
  { id: 'heartbreak', name: 'Heartbreak', icon: Heart, items: [7, 1] },
  { id: 'adrenaline', name: 'Adrenaline', icon: Compass, items: [4, 6] }
];

interface CustomPlaylist {
  id: string;
  name: string;
  titles: Title[];
}

export default function MoodPlaylistsPage() {
  const [selectedMood, setSelectedMood] = useState<string>('feel-good');
  const [customPlaylists, setCustomPlaylists] = useState<CustomPlaylist[]>([
    {
      id: '1',
      name: 'Weekend Chill',
      titles: [CATALOG_ITEMS[0], CATALOG_ITEMS[2], CATALOG_ITEMS[7], CATALOG_ITEMS[6]]
    },
    {
      id: '2',
      name: 'Late Night Anime',
      titles: [CATALOG_ITEMS[3], CATALOG_ITEMS[5], CATALOG_ITEMS[0], CATALOG_ITEMS[1]]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Modal Form State
  const [playlistName, setPlaylistName] = useState('');
  const [selectedTitleIds, setSelectedTitleIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'genre'>('search');
  const [selectedGenre, setSelectedGenre] = useState<string>('Action');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);

  const activeMoodData = MOODS.find(m => m.id === selectedMood) || MOODS[0];
  const moodTitles = CATALOG_ITEMS.filter(item => activeMoodData.items.includes(item.id));

  // Toggle modal open/close
  const handleOpenCreateModal = () => {
    setPlaylistName('');
    setSelectedTitleIds([]);
    setEditingPlaylistId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (playlist: CustomPlaylist) => {
    setEditingPlaylistId(playlist.id);
    setPlaylistName(playlist.name);
    setSelectedTitleIds(playlist.titles.map(t => t.id));
    setIsModalOpen(true);
  };

  // Handle playlist save
  const handleSavePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    const titlesList = CATALOG_ITEMS.filter(item => selectedTitleIds.includes(item.id));

    if (editingPlaylistId) {
      setCustomPlaylists(prev => prev.map(p => 
        p.id === editingPlaylistId ? { ...p, name: playlistName, titles: titlesList } : p
      ));
    } else {
      const newPlaylist: CustomPlaylist = {
        id: Math.random().toString(),
        name: playlistName,
        titles: titlesList
      };
      setCustomPlaylists(prev => [...prev, newPlaylist]);
    }

    setIsModalOpen(false);
  };

  const handleDeletePlaylist = (id: string) => {
    setCustomPlaylists(prev => prev.filter(p => p.id !== id));
    setActiveMenuId(null);
  };

  // Genre auto-populate titles
  const handleGenrePopulate = (genre: string) => {
    setSelectedGenre(genre);
    const matched = CATALOG_ITEMS.filter(item => item.genres.includes(genre)).map(t => t.id);
    setSelectedTitleIds(matched);
  };

  const filteredSearchTitles = CATALOG_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans relative">
      <main className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full select-none flex flex-col gap-10">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-0.5 border-b border-[#1A1A1A] pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="text-[#FF4C00] shrink-0" size={24} fill="currentColor" />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                Mood Playlists
              </h1>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">
              Curated picks based on your mood, or build your own custom sets.
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

        {/* SECTION 1: PICK YOUR MOOD */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
            Pick Your Mood
          </h2>
          
          {/* Horizontal scroll row */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none -mx-2 px-2 scroll-smooth">
            {MOODS.map((mood) => {
              const MoodIcon = mood.icon;
              const isSelected = selectedMood === mood.id;

              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-200 shrink-0 outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#FF4C00] text-white shadow-[0_0_20px_rgba(255,76,0,0.15)] font-bold'
                      : 'bg-[#0E0E0E] border-[#1A1A1A] text-zinc-400 hover:text-white hover:border-zinc-800'
                  }`}
                >
                  <MoodIcon size={16} className={isSelected ? 'text-[#FF4C00]' : ''} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{mood.name}</span>
                </button>
              );
            })}
          </div>

          {/* Generated Mood Titles */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 mt-2">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">
              Generated for: <span className="text-[#FF4C00]">{activeMoodData.name}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {moodTitles.map((title) => (
                <div key={title.id} className="group relative flex flex-col gap-2 transition-transform duration-300 w-full">
                  <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 group-hover:border-[#FF4C00]/30 transition-all duration-300">
                    <img 
                      src={title.unsplash_url} 
                      alt={title.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all"
                    />
                  </div>
                  <span className="text-xs font-bold text-white truncate w-full group-hover:text-[#FF4C00] transition-colors mt-1">
                    {title.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: YOUR PLAYLISTS */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-zinc-300 tracking-wide uppercase">
            Your Playlists
          </h2>

          {customPlaylists.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-md mx-auto my-6 w-full">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 mb-4 border border-zinc-850">
                <Music size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">You haven't created any playlists yet</h3>
              <p className="text-xs text-zinc-550 leading-relaxed mb-5">
                Build your own collections of titles to stream.
              </p>
              <button 
                onClick={handleOpenCreateModal}
                className="bg-[#FF4C00] hover:bg-[#e04300] text-black font-black text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
              >
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* "+ Create New" Card Tile */}
              <button 
                onClick={handleOpenCreateModal}
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#FF4C00]/30 hover:border-[#FF4C00] bg-[#0E0E0E]/40 hover:bg-[#FF4C00]/5 text-zinc-400 hover:text-white rounded-2xl p-6 h-full min-h-[220px] transition-all duration-300 outline-none cursor-pointer group shadow-sm"
              >
                <Plus size={28} className="text-[#FF4C00] group-hover:scale-110 transition-transform mb-2" strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-wider">Create New</span>
              </button>

              {/* Playlist Cards */}
              {customPlaylists.map((playlist) => {
                const collages = playlist.titles.slice(0, 4);

                return (
                  <div 
                    key={playlist.id} 
                    className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex flex-col gap-4 relative group hover:border-[#FF4C00]/30 transition-colors shadow-sm"
                  >
                    {/* 2x2 Collage Container */}
                    <div className="aspect-[2/3] md:aspect-video rounded-xl overflow-hidden bg-zinc-950 grid grid-cols-2 gap-px relative">
                      {collages.map((t, i) => (
                        <img 
                          key={i} 
                          src={t.unsplash_url} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      ))}
                      {collages.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-650 bg-zinc-950">
                          <Music size={24} />
                        </div>
                      )}
                    </div>

                    {/* Playlist Info */}
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="flex flex-col min-w-0 gap-0.5">
                        <span className="text-xs font-bold text-white truncate uppercase tracking-wider">
                          {playlist.name}
                        </span>
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                          {playlist.titles.length} {playlist.titles.length === 1 ? 'Title' : 'Titles'}
                        </span>
                      </div>

                      {/* Dropdown Options Anchor */}
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === playlist.id ? null : playlist.id)}
                          className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuId === playlist.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 mt-2 bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl shadow-2xl p-1.5 w-32 z-40 flex flex-col gap-0.5">
                              <button 
                                onClick={() => handleOpenEditModal(playlist)}
                                className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-950 w-full text-left transition-colors cursor-pointer"
                              >
                                <Edit3 size={12} className="text-[#FF4C00]" />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeletePlaylist(playlist.id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/20 w-full text-left transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </section>

      </main>

      {/* CREATE/EDIT PLAYLIST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full h-full sm:h-auto sm:max-w-lg bg-[#0E0E0E] border-0 sm:border sm:border-[#1A1A1A] rounded-none sm:rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden select-none animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                {editingPlaylistId ? 'Edit Playlist' : 'Create Playlist'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form content */}
            <form onSubmit={handleSavePlaylist} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-h-[80vh] sm:max-h-[60vh]">
              
              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                  Playlist Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Action Favorites"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#FF4C00] focus:ring-1 focus:ring-[#FF4C00]/20 hover:border-zinc-750 transition-all placeholder:text-zinc-600"
                />
              </div>

              {/* Cover Auto-Generated Note */}
              <div className="bg-[#141414] border border-[#262626]/40 p-4 rounded-xl flex items-start gap-3">
                <Info size={16} className="text-[#FF4C00] shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-450 leading-relaxed font-semibold">
                  Playlist cover collage will be automatically compiled from the first 4 added titles.
                </p>
              </div>

              {/* Navigation Tabs (Add Titles / Add by Genre) */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex border-b border-[#1A1A1A]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('search')}
                    className={`flex-1 pb-3 text-[10px] font-bold uppercase tracking-wider transition-all outline-none cursor-pointer border-b-2 ${
                      activeTab === 'search'
                        ? 'border-[#FF4C00] text-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Add Titles
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('genre')}
                    className={`flex-1 pb-3 text-[10px] font-bold uppercase tracking-wider transition-all outline-none cursor-pointer border-b-2 ${
                      activeTab === 'genre'
                        ? 'border-[#FF4C00] text-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Add by Genre
                  </button>
                </div>

                {/* Tab content 1: Add Titles Search */}
                {activeTab === 'search' && (
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#FF4C00]/50 transition-all placeholder:text-zinc-650"
                      />
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>

                    {/* Titles Checklist */}
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto border border-[#1A1A1A] rounded-xl p-2 bg-[#0A0A0A]">
                      {filteredSearchTitles.map((title) => {
                        const isChecked = selectedTitleIds.includes(title.id);
                        return (
                          <label 
                            key={title.id} 
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-950 cursor-pointer select-none transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={title.unsplash_url} 
                                alt="" 
                                className="w-8 h-8 rounded object-cover" 
                              />
                              <span className="text-xs font-semibold text-zinc-300">{title.title}</span>
                            </div>
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedTitleIds(prev => prev.filter(id => id !== title.id));
                                } else {
                                  setSelectedTitleIds(prev => [...prev, title.id]);
                                }
                              }}
                              className="checkbox checkbox-xs border-zinc-700 checked:bg-[#FF4C00] checked:border-[#FF4C00] rounded accent-[#FF4C00]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab content 2: Add by Genre */}
                {activeTab === 'genre' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">
                      Select Primary Genre
                    </label>
                    
                    <div className="flex flex-wrap gap-2">
                      {["Action", "Adventure", "Sci-Fi", "Drama", "Anime", "Comedy"].map((genre) => {
                        const isSelected = selectedGenre === genre;
                        return (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => handleGenrePopulate(genre)}
                            className={`px-3.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF4C00]/10 border-[#FF4C00] text-[#FF4C00]'
                                : 'bg-[#141414] border-[#262626] text-zinc-400 hover:text-white'
                            }`}
                          >
                            {genre}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[9px] text-zinc-550 italic font-semibold mt-1">
                      *Selecting a genre will automatically pre-check all matches.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-[#262626] hover:bg-zinc-950 text-zinc-400 hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF4C00] hover:bg-[#e04300] text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4C00]/10"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
