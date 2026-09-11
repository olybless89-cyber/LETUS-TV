import { formatDistanceToNowStrict } from "date-fns";

export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return `${formatDistanceToNowStrict(d)} ago`;
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
  /(?:youtu\.be\/)([^?&\s]+)/,
  /(?:youtube\.com\/embed\/)([^?&\s]+)/,
];

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
