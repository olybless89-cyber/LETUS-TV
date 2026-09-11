export type SocialPlatform = "INSTAGRAM" | "TIKTOK" | "FACEBOOK";

export function detectSocialPlatform(url: string): SocialPlatform | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("instagram.com")) return "INSTAGRAM";
    if (host.includes("tiktok.com")) return "TIKTOK";
    if (host.includes("facebook.com") || host.includes("fb.watch")) return "FACEBOOK";
    return null;
  } catch {
    return null;
  }
}
