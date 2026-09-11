import Link from "next/link";
import type { SiteSettings } from "@prisma/client";
import { NewsletterForm } from "@/components/newsletter-form";

const CATEGORIES = ["entertainment", "sports", "politics", "business", "health", "tech"];

const SOCIAL_LINKS = [
  { label: "YouTube", url: "https://youtube.com/@letus-tv" },
  { label: "Instagram", url: "https://www.instagram.com/letus_tv" },
  { label: "TikTok", url: "https://www.tiktok.com/@letustv" },
  { label: "Facebook", url: "https://www.facebook.com/share/14neP8cQQQV/" },
];

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-blue-deep text-paper">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Letus<span className="text-blue-bright">TV</span>
          </h2>
          <p className="mt-3 max-w-xs text-sm text-paper/70">
            {settings?.description ??
              "A vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages."}
          </p>
          <p className="mt-4 font-display text-sm text-gold">
            {settings?.tagline ?? "Let's Watch. Let's Know. Let's Connect."}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper/60">Sections</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((slug) => (
              <li key={slug}>
                <Link href={`/category/${slug}`} className="capitalize hover:text-gold">
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper/60">Letus TV</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/live" className="hover:text-gold">Watch Live</Link></li>
            <li><Link href="/articles" className="hover:text-gold">Latest News</Link></li>
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
          <p>&copy; {year} Letus TV. All rights reserved.</p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
