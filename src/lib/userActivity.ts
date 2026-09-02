export type ActivityMode = 'Watched' | 'Explored' | 'Saved' | 'Liked';

export type ActivityMoviePayload = {
  id?: string | number;
  title: string;
  image?: string;
  unsplash_url?: string;
  category?: string;
  year?: string | number;
  rating?: string | number;
  duration?: string;
};

export async function logUserActivity(
  activityType: ActivityMode,
  movie: ActivityMoviePayload
) {
  try {
    const response = await fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityType,
        movieId: movie.id ?? movie.title,
        title: movie.title,
        poster: movie.image ?? movie.unsplash_url ?? '',
        category: movie.category ?? 'Movie',
        year: movie.year ?? new Date().getFullYear(),
        rating: movie.rating ?? 8.5,
        duration: movie.duration ?? '2h 20m',
      }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to log user activity:', error);
    return null;
  }
}
