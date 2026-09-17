export function getServerUrl(): string {
  const isBrowser = typeof window !== 'undefined';
  const isHttps = isBrowser && window.location.protocol === 'https:';

  // If in browser on HTTPS live deployment, never return http:// localhost
  if (isHttps) {
    if (process.env.NEXT_PUBLIC_SERVER_URL && process.env.NEXT_PUBLIC_SERVER_URL.startsWith('https://')) {
      return process.env.NEXT_PUBLIC_SERVER_URL;
    }
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('https://')) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return 'https://flixora-server.vercel.app';
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Auto-detect production domain vs local dev
  if (isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://flixora-server.vercel.app';
  }
  return 'http://localhost:5000';
}
