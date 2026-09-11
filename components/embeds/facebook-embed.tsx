"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: Element) => void } };
  }
}

export function FacebookEmbed({ url, caption }: { url: string; caption?: string | null }) {
  useEffect(() => {
    if (!document.getElementById("fb-root")) {
      const root = document.createElement("div");
      root.id = "fb-root";
      document.body.prepend(root);
    }

    if (window.FB) {
      window.FB.XFBML.parse();
      return;
    }

    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, [url]);

  const isVideo = url.includes("/videos/");

  return (
    <div>
      <div className={isVideo ? "fb-video" : "fb-post"} data-href={url} data-width="auto" data-show-text="true" />
      {caption && <p className="mt-2 text-xs text-ink-soft">{caption}</p>}
    </div>
  );
}
