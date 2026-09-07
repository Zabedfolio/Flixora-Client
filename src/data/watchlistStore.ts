/* =========================================================
   WATCHLIST STORE (DATABASE BACKED VIA /api/lists)
   Provides reactive client-side store with 0ms optimistic UI
   updates synced directly to MongoDB Atlas 'Lists' collection.
 ========================================================= */

export interface WatchlistItem {
  id: string;
  movieId?: string;
  title: string;
  year: string;
  duration: string;
  category: string;
  unsplash_url: string;
  createdAt?: string;
}

let watchlistCache: WatchlistItem[] = [];
let hasInitialFetched = false;
let isFetching = false;

function cleanKey(val: string): string {
  return String(val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function triggerUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('watchlist-updated'));
  }
}

export function getWatchlist(): WatchlistItem[] {
  if (!hasInitialFetched && typeof window !== 'undefined') {
    fetchWatchlist();
  }
  return watchlistCache;
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  if (isFetching) return watchlistCache;
  isFetching = true;

  try {
    const res = await fetch('/api/lists');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        watchlistCache = data.items.map((item: any) => ({
          id: item.movieId || item.id,
          movieId: item.movieId || item.id,
          title: item.title,
          year: item.year || '',
          duration: item.duration || '',
          category: item.category || 'Movie',
          unsplash_url: item.unsplash_url || '',
          createdAt: item.createdAt,
        }));
        hasInitialFetched = true;
        triggerUpdate();
      }
    }
  } catch (err) {
    console.error('Failed to fetch watchlist from database:', err);
  } finally {
    isFetching = false;
  }

  return watchlistCache;
}

export function addToWatchlist(item: WatchlistItem) {
  const cleanId = cleanKey(item.id || item.title);
  const exists = watchlistCache.some(
    (w) => cleanKey(w.id || w.title) === cleanId || cleanKey(w.title) === cleanKey(item.title)
  );

  if (!exists) {
    // 1. Optimistic Local Update (0ms instant response)
    const newItem: WatchlistItem = {
      ...item,
      id: item.id || cleanId,
      movieId: item.id || cleanId,
    };
    watchlistCache = [newItem, ...watchlistCache];
    triggerUpdate();

    // 2. Async Sync with MongoDB Atlas 'Lists' Collection
    fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: newItem.id,
        title: newItem.title,
        year: newItem.year,
        duration: newItem.duration,
        category: newItem.category,
        unsplash_url: newItem.unsplash_url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          fetchWatchlist();
        }
      })
      .catch(() => {
        fetchWatchlist();
      });
  }
}

export function removeFromWatchlist(titleOrId: string) {
  const targetKey = cleanKey(titleOrId);

  // 1. Optimistic Local Update (0ms instant response)
  watchlistCache = watchlistCache.filter(
    (w) => cleanKey(w.id) !== targetKey && cleanKey(w.title) !== targetKey
  );
  triggerUpdate();

  // 2. Async Sync with MongoDB Atlas 'Lists' Collection
  fetch('/api/lists', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      movieId: titleOrId,
      title: titleOrId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        fetchWatchlist();
      }
    })
    .catch(() => {
      fetchWatchlist();
    });
}

export function isInWatchlist(titleOrId: string): boolean {
  if (!hasInitialFetched && typeof window !== 'undefined') {
    fetchWatchlist();
  }
  const targetKey = cleanKey(titleOrId);
  return watchlistCache.some(
    (w) => cleanKey(w.id) === targetKey || cleanKey(w.title) === targetKey
  );
}

export function getWatchlistCount(): number {
  return watchlistCache.length;
}

// Auto fetch on window load if in browser
if (typeof window !== 'undefined') {
  fetchWatchlist();
}
