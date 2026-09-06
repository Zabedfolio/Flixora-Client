'use client';

import { useEffect, useRef } from 'react';

export default function SessionTracker() {
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Generate or retrieve Session ID for current browser tab
    let storedSessionId = sessionStorage.getItem('flixora_session_id');
    if (!storedSessionId) {
      storedSessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('flixora_session_id', storedSessionId);
    }
    sessionIdRef.current = storedSessionId;

    const sendTelemetry = async (eventType: 'heartbeat' | 'trailer_click' | 'movie_play', activeSeconds = 30) => {
      try {
        await fetch('/api/telemetry/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            eventType,
            activeSeconds,
          }),
        });
      } catch (err) {
        // Silent error catch for telemetry
      }
    };

    // Initial heartbeat on mount
    sendTelemetry('heartbeat', 5);

    // 2. Heartbeat interval every 30s when tab is visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendTelemetry('heartbeat', 30);
      }
    }, 30000);

    // 3. Listen for trailer play & movie play custom events
    const handleTrailerClick = () => sendTelemetry('trailer_click', 0);
    const handleMoviePlay = () => sendTelemetry('movie_play', 0);

    window.addEventListener('flixora-trailer-click', handleTrailerClick);
    window.addEventListener('flixora-movie-play', handleMoviePlay);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('flixora-trailer-click', handleTrailerClick);
      window.removeEventListener('flixora-movie-play', handleMoviePlay);
    };
  }, []);

  return null;
}
