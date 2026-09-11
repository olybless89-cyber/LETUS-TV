"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export function InstagramEmbed({ url, caption }: { url: string; caption?: string | null }) {
  useEffect(() => {
    const process = () => window.instgrm?.Embeds?.process();

    if (window.instgrm) {
      process();
      return;
    }

    const existing = document.getElementById("instagram-embed-script");
    if (existing) {
      existing.addEventListener("load", process);
      return;
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);
  }, [url]);

  return (
    <div>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "#0b1220", border: 0, margin: 0, width: "100%" }}
      />
      {caption && <p className="mt-2 text-xs text-ink-soft">{caption}</p>}
    </div>
  );
}
