const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const getHeaders = () => {
  const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN;
  return {
    accept: 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

const getApiKeyQueryParam = () => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
  return apiKey ? `api_key=${apiKey}` : '';
};

export async function fetchFromTMDB<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = getHeaders();
  const separator = endpoint.includes('?') ? '&' : '?';
  const apiKeyQuery = getApiKeyQueryParam();
  
  // Use Bearer token if available, otherwise append api_key query parameter
  const url = headers.Authorization 
    ? `${TMDB_BASE_URL}${endpoint}` 
    : `${TMDB_BASE_URL}${endpoint}${separator}${apiKeyQuery}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    next: { revalidate: 3600 }, // Cache response for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API call failed: ${response.statusText} (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getTMDBImageUrl(path: string | null, size: 'w200' | 'w400' | 'w500' | 'original' = 'w500'): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop'; // High quality fallback poster
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
