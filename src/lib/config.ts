export function getServerUrl(): string {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Auto-detect production browser environment vs local dev
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://flixora-server.vercel.app';
  }
  return 'http://localhost:5000';
}
