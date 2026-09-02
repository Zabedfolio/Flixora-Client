import { PlaylistItem } from '@/components/playlist/PlaylistCard';

let memoryPlaylists: PlaylistItem[] | null = null;
let lastFetchedAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL
const listeners = new Set<(playlists: PlaylistItem[]) => void>();

export function getCachedPlaylists(): PlaylistItem[] | null {
  return memoryPlaylists;
}

export function setCachedPlaylists(playlists: PlaylistItem[]) {
  memoryPlaylists = playlists;
  lastFetchedAt = Date.now();
  listeners.forEach((listener) => {
    try {
      listener(playlists);
    } catch (e) {
      console.error(e);
    }
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('playlists-updated', { detail: playlists }));
  }
}

export function subscribeToPlaylistCache(listener: (playlists: PlaylistItem[]) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function fetchPlaylistsFast(force = false): Promise<PlaylistItem[]> {
  const isFresh = memoryPlaylists && Date.now() - lastFetchedAt < CACHE_TTL_MS;
  if (!force && isFresh) {
    return memoryPlaylists!;
  }

  try {
    const res = await fetch('/api/playlist');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.playlists)) {
        setCachedPlaylists(data.playlists);
        return data.playlists;
      }
    }
  } catch (err) {
    console.error('Failed to fetch playlists:', err);
  }

  return memoryPlaylists || [];
}
