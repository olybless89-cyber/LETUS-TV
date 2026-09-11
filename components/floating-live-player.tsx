"use client";

import { useEffect, useRef, useState } from "react";
import { LETUS_TV_CHANNEL_ID } from "@/lib/youtube";

function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  return match ? match[1] : null;
}

export function FloatingLivePlayer({
  anchorRef,
  streamUrl,
  streamType,
  isVisible,
  title,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  streamUrl?: string | null;
  streamType?: string | null;
  isVisible: boolean;
  title: string;
}) {
  const [showFloating, setShowFloating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || !isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowFloating(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchorRef, isVisible]);

  if (!isVisible || dismissed || !showFloating) return null;

  // Only YouTube is supported for the floating auto-playing embed.
  const isYouTube = !streamType || streamType === "YOUTUBE";
  if (!isYouTube) return null;

  const videoId = getYouTubeId(streamUrl);
  const embedSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
    : `https://www.youtube.com/embed/live_stream?channel=${LETUS_TV_CHANNEL_ID}&autoplay=1&mute=1`;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 overflow-hidden border border-white/10 bg-ink shadow-2xl sm:w-80">
      <div className="flex items-center justify-between bg-blue-deep px-3 py-1.5">
        <span className="flex items-center gap-1.5 font-display text-xs font-bold text-paper">
          <span className="h-1.5 w-1.5 rounded-full bg-live animate-live-pulse" />
          {title}
        </span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close"
          className="text-paper/70 hover:text-paper"
        >
          ✕
        </button>
      </div>
      <div className="relative aspect-video w-full">
        <iframe
          src={embedSrc}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
