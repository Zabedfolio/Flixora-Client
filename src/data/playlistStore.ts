/* =========================================================
   PLAYLIST STORE (IN-MEMORY)
   Provides centralized management for the user's custom playlists.
  ========================================================= */

export interface PlaylistTitle {
  title: string;
  unsplash_url: string;
  category: string;
  year: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  tag?: string;
  titles: PlaylistTitle[];
}

let playlistsCache: Playlist[] = [];

export function getPlaylists(): Playlist[] {
  return playlistsCache;
}

export function createPlaylist(name: string, tag?: string): Playlist {
  const newPlaylist: Playlist = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    tag: tag || undefined,
    titles: []
  };
  playlistsCache = [...playlistsCache, newPlaylist];
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('playlists-updated'));
  }
  return newPlaylist;
}

export function addTitleToPlaylist(playlistId: string, titleData: PlaylistTitle) {
  playlistsCache = playlistsCache.map(pl => {
    if (pl.id === playlistId) {
      // Avoid duplicates
      if (pl.titles.some(t => t.title.toLowerCase() === titleData.title.toLowerCase())) {
        return pl;
      }
      return {
        ...pl,
        titles: [...pl.titles, titleData]
      };
    }
    return pl;
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('playlists-updated'));
  }
}

export function removeTitleFromPlaylist(playlistId: string, title: string) {
  playlistsCache = playlistsCache.map(pl => {
    if (pl.id === playlistId) {
      return {
        ...pl,
        titles: pl.titles.filter(t => t.title.toLowerCase() !== title.toLowerCase())
      };
    }
    return pl;
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('playlists-updated'));
  }
}

export function isTitleInPlaylist(playlistId: string, title: string): boolean {
  const pl = playlistsCache.find(p => p.id === playlistId);
  if (!pl) return false;
  return pl.titles.some(t => t.title.toLowerCase() === title.toLowerCase());
}

export function deletePlaylist(id: string) {
  playlistsCache = playlistsCache.filter(pl => pl.id !== id);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('playlists-updated'));
  }
}
