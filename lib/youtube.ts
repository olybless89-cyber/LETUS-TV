import Parser from "rss-parser";

export const LETUS_TV_CHANNEL_ID = "UCPjeBKYq8V97xWerZIPRifg";

export type YouTubeVideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: Date;
};

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; LetusTV/1.0)" },
});

type CacheEntry = { items: YouTubeVideoItem[]; fetchedAt: number };
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
let cache: CacheEntry | null = null;

function extractVideoId(link: string | undefined): string | null {
  if (!link) return null;
  const match = link.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

async function fetchFeed(url: string): Promise<YouTubeVideoItem[]> {
  const feed = await parser.parseURL(url);
  return (feed.items || [])
    .map((item) => {
      const id = extractVideoId(item.link);
      if (!id) return null;
      return {
        id,
        title: item.title?.trim() || "Untitled",
        description: (item.contentSnippet || item.content || "").slice(0, 300),
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
      };
    })
    .filter((v): v is YouTubeVideoItem => v !== null);
}

async function fetchViaDataApi(apiKey: string): Promise<YouTubeVideoItem[]> {
  const uploadsPlaylistId = "UU" + LETUS_TV_CHANNEL_ID.slice(2);
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`YouTube Data API returned ${res.status}`);
  }
  const data = await res.json();

  type ApiItem = {
    snippet: {
      title: string;
      description?: string;
      publishedAt: string;
      resourceId: { videoId: string };
      thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    };
  };

  return ((data.items || []) as ApiItem[]).map((item) => {
    const id = item.snippet.resourceId.videoId;
    const thumb =
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url ||
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return {
      id,
      title: item.snippet.title?.trim() || "Untitled",
      description: (item.snippet.description || "").slice(0, 300),
      thumbnailUrl: thumb,
      publishedAt: new Date(item.snippet.publishedAt),
    };
  });
}

async function fetchChannelVideos(): Promise<YouTubeVideoItem[]> {
  // The official Data API doesn't have the flaky-from-datacenter-IPs problem
  // that YouTube's RSS feeds sometimes have, so prefer it when a key is set.
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const items = await fetchViaDataApi(apiKey);
      if (items.length > 0) return items;
    } catch (err) {
      console.error("YouTube Data API fetch failed, falling back to RSS:", err);
    }
  }

  // The uploads-playlist feed (UU + channel ID minus its UC prefix) is the
  // definitive list of everything a channel has published. The plain
  // channel_id feed sometimes under-reports videos for smaller/newer
  // channels, so try that first and fall back if it comes back empty.
  const uploadsPlaylistId = "UU" + LETUS_TV_CHANNEL_ID.slice(2);
  try {
    const items = await fetchFeed(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${uploadsPlaylistId}`
    );
    if (items.length > 0) return items;
  } catch {
    // fall through to the backup feed below
  }

  try {
    return await fetchFeed(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${LETUS_TV_CHANNEL_ID}`
    );
  } catch {
    return [];
  }
}

async function getCachedChannelVideos(): Promise<YouTubeVideoItem[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.items;
  const items = await fetchChannelVideos();
  if (items.length > 0) {
    cache = { items, fetchedAt: now };
    return items;
  }
  return cache?.items ?? [];
}

export async function getChannelVideos(limit: number = 12): Promise<YouTubeVideoItem[]> {
  const items = await getCachedChannelVideos();
  return items.slice(0, limit);
}

export async function getChannelVideoById(id: string): Promise<YouTubeVideoItem | null> {
  const items = await getCachedChannelVideos();
  return items.find((v) => v.id === id) ?? null;
}

