/* =========================================================
   WATCHLIST STORE (IN-MEMORY)
   Provides centralized management for the user's watchlist.
   Easily replaceable with database / API calls later.
 ========================================================= */

export interface WatchlistItem {
  id: string;
  title: string;
  year: string;
  duration: string;
  category: string;
  unsplash_url: string;
}

let watchlist: WatchlistItem[] = [];

export function getWatchlist(): WatchlistItem[] {
  return watchlist;
}

export function addToWatchlist(item: WatchlistItem) {
  if (!watchlist.some(w => w.title === item.title)) {
    watchlist.push(item);
    triggerUpdate();
  }
}

export function removeFromWatchlist(title: string) {
  watchlist = watchlist.filter(w => w.title !== title);
  triggerUpdate();
}

export function isInWatchlist(title: string): boolean {
  return watchlist.some(w => w.title === title);
}

export function getWatchlistCount(): number {
  return watchlist.length;
}

function triggerUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('watchlist-updated'));
  }
}
