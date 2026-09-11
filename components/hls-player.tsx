"use client";

import { useEffect, useRef, useState } from "react";

export function HlsPlayer({ src, poster }: { src: string; poster?: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) setError("Stream is currently unavailable.");
          });
        } else {
          setError("Your browser can't play this live stream.");
        }
      });
    }

    return () => {
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <video ref={videoRef} controls autoPlay muted playsInline poster={poster ?? undefined} className="h-full w-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-4 text-center font-display text-sm text-paper/80">
          {error}
        </div>
      )}
    </div>
  );
}
