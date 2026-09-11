import Image from "next/image";
import Link from "next/link";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from "@/components/social-icons";

type TickerItem = { title: string; href: string };

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live TV" },
  { href: "/articles", label: "News" },
  { href: "/videos", label: "Videos" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { label: "YouTube", url: "https://youtube.com/@letus-tv", Icon: YouTubeIcon },
  { label: "Instagram", url: "https://www.instagram.com/letus_tv", Icon: InstagramIcon },
  { label: "TikTok", url: "https://www.tiktok.com/@letustv", Icon: TikTokIcon },
  { label: "Facebook", url: "https://www.facebook.com/share/14neP8cQQQV/", Icon: FacebookIcon },
];

export function Header({
  breaking,
  siteName,
}: {
  breaking: TickerItem[];
  siteName?: string;
}) {
  const items = breaking.length > 0 ? breaking : null;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo.png"
            alt={siteName ?? "Letus TV"}
            width={44}
            height={44}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-display font-bold text-xl text-blue-deep leading-none">
            Letus<span className="text-blue-bright">TV</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-display text-[0.92rem] text-ink-soft">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            {SOCIALS.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-deep text-paper transition-transform hover:scale-110 hover:bg-blue"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <Link
            href="/live"
            className="flex items-center gap-2 rounded-sm bg-live px-3 py-1.5 text-paper font-display text-sm font-semibold"
          >
            <span className="h-2 w-2 rounded-full bg-paper animate-live-pulse" />
            Live Now
          </Link>
        </div>
      </div>

      {items && (
        <div className="border-t border-line bg-blue-deep text-paper">
          <div className="container-page flex items-center gap-3 py-2 overflow-hidden">
            <span className="shrink-0 bg-live px-2 py-0.5 text-xs font-display font-bold tracking-wide rounded-sm">
              BREAKING
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div className="flex w-max gap-16 animate-ticker whitespace-nowrap">
                {[...items, ...items].map((item, i) => (
                  <a
                    key={`${item.href}-${i}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
