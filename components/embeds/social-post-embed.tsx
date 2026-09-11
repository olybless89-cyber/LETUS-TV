import { InstagramEmbed } from "@/components/embeds/instagram-embed";
import { TikTokEmbed } from "@/components/embeds/tiktok-embed";
import { FacebookEmbed } from "@/components/embeds/facebook-embed";

export function SocialPostEmbed({
  platform,
  url,
  caption,
}: {
  platform: string;
  url: string;
  caption?: string | null;
}) {
  if (platform === "INSTAGRAM") return <InstagramEmbed url={url} caption={caption} />;
  if (platform === "TIKTOK") return <TikTokEmbed url={url} caption={caption} />;
  if (platform === "FACEBOOK") return <FacebookEmbed url={url} caption={caption} />;
  return null;
}
