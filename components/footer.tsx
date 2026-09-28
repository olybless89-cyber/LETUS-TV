import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@prisma/client";
import { NewsletterForm } from "@/components/newsletter-form";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from "@/components/social-icons";

const SOCIAL_LINKS = [
  { label: "YouTube", url: "https://youtube.com/@letus-tv", Icon: YouTubeIcon },
  { label: "Instagram", url: "https://www.instagram.com/letus_tv", Icon: InstagramIcon },
  { label: "TikTok", url: "https://www.tiktok.com/@letustv", Icon: TikTokIcon },
  { label: "Facebook", url: "https://www.facebook.com/share/14neP8cQQQV/", Icon: FacebookIcon },
];

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-blue-deep text-paper">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Image
            src="/images/logo.png"
            alt="Letus TV"
            width={1065}
            height={369}
            className="h-14 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm text-paper/70">
            {settings?.description ??
              "A vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages."}
          </p>
          <p className="mt-4 font-display text-sm text-gold">
            {settings?.tagline ?? "Let's Watch. Let's Know. Let's Connect."}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper/60">Watch</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/live" className="hover:text-gold">Watch Live</Link></li>
            <li><Link href="/videos" className="hover:text-gold">All Videos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper/60">Letus TV</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/live" className="hover:text-gold">Watch Live</Link></li>
            <li><Link href="/videos" className="hover:text-gold">Videos</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper/60">Get the headlines</h3>
          <p className="mt-4 text-sm text-paper/70">
            One email a day. No noise.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} Letus TV. All rights reserved.
            <span className="mx-2 text-paper/30">|</span>
            Powered by{" "}
            <a
              href="https://digitalweboracleict.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gold hover:underline"
            >
              DWO
            </a>
          </p>
          <div className="flex gap-2">
            {SOCIAL_LINKS.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-paper transition-transform hover:scale-110 hover:bg-gold hover:text-blue-deep"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
