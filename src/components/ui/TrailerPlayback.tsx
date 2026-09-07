"use client";

import React, { useEffect, useRef } from "react";

interface TrailerPlaybackProps {
  trailerEmbedUrl: string;
  MovieTitle: string;
}

const TrailerPlayback: React.FC<TrailerPlaybackProps> = ({
  trailerEmbedUrl,
  MovieTitle,
  userId,
  movie,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasTrackedRef = useRef<boolean>(false);
  console.log(movie);

  // 🔄  tracking state  false
  useEffect(() => {
    hasTrackedRef.current = false;
  }, [trailerEmbedUrl]);

  // Save watch history when user trailer
  const saveWatchHistory = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/activity/watch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            genres:movie.genres, 
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // YouTube Security Check
      if (
        !event.origin.match(/^https?:\/\/(www\.)?youtube(-nocookie)?\.com$/)
      ) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Player State 1 = Playing
        if (
          data.event === "infoDelivery" &&
          data.info &&
          data.info.playerState === 1
        ) {
          if (!hasTrackedRef.current) {
            hasTrackedRef.current = true;
            saveWatchHistory(userId);
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [MovieTitle]);

  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "listening", id: 1 }),
        "*",
      );
    }
  };

  const formattedEmbedUrl = trailerEmbedUrl
    ? `${trailerEmbedUrl}${trailerEmbedUrl.includes("?") ? "&" : "?"}enablejsapi=1`
    : "";

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
      {trailerEmbedUrl ? (
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad} // Iframe Load
          className="h-full w-full rounded-2xl border-0"
          src={formattedEmbedUrl}
          title={`${MovieTitle} Official Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full items-center justify-center text-zinc-500 font-semibold uppercase tracking-wider bg-zinc-950">
          No official trailer available
        </div>
      )}
    </div>
  );
};

export default TrailerPlayback;
