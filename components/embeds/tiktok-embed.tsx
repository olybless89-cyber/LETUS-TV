"use client";

import { useEffect } from "react";

export function TikTokEmbed({ url, caption }: { url: string; caption?: string | null }) {
  useEffect(() => {
    // TikTok's embed.js scans the DOM for blockquote.tiktok-embed on load/execute.
    // Re-inserting the script forces a rescan so late-mounted embeds still render.
    const existing = document.getElementById("tiktok-embed-script");
    existing?.remove();

    const script = document.createElement("script");
    script.id = "tiktok-embed-script";
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  return (
    <div>
      <blockquote className="tiktok-embed" cite={url} style={{ maxWidth: "100%", minWidth: "100%" }}>
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View on TikTok
          </a>
        </section>
      </blockquote>
      {caption && <p className="mt-2 text-xs text-ink-soft">{caption}</p>}
    </div>
  );
}
