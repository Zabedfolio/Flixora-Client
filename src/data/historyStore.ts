/* =========================================================
   HISTORY STORE (IN-MEMORY)
   Provides centralized management for the user's viewing history.
  ========================================================= */

export interface HistoryItem {
  id: string;
  movieId?: string;
  title: string;
  type: 'movie' | 'tv';
  genres: string[];
  unsplash_url: string;
  watchedDate: string;
  progressPercent?: number; // if continue watching
  timeLeftMin?: number; // if continue watching
  hoursWatched: number; // hours watched for stats
}

const INITIAL_HISTORY: HistoryItem[] = [];

let historyCache: HistoryItem[] = [...INITIAL_HISTORY];

export function getHistory(): HistoryItem[] {
  return historyCache;
}

export function clearHistory() {
  historyCache = [];
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('history-updated'));
  }
}

export function deleteHistoryItem(id: string) {
  historyCache = historyCache.filter(item => item.id !== id);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('history-updated'));
  }
}

export function addToHistory(item: Omit<HistoryItem, 'id' | 'watchedDate'>) {
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substring(2, 9),
    watchedDate: new Date().toISOString().split('T')[0]
  };
  historyCache = [newItem, ...historyCache];
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('history-updated'));
  }
}
