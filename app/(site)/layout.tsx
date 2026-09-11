import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLatestVideos, getSiteSettings, getBreakingArticles } from "@/lib/server-data";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Letus TV — Let's Watch. Let's Know. Let's Connect.",
  description:
    "Letus TV is a vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages.",
  openGraph: {
    title: "Letus TV — Let's Watch. Let's Know. Let's Connect.",
    description:
      "Letus TV is a vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Letus TV" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Letus TV — Let's Watch. Let's Know. Let's Connect.",
    description:
      "Letus TV is a vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages.",
    images: ["/images/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [videos, settings, breakingArticles] = await Promise.all([
    getLatestVideos(6).catch(() => []),
    getSiteSettings().catch(() => null),
    getBreakingArticles(6).catch(() => []),
  ]);
  const breaking =
    breakingArticles.length > 0
      ? breakingArticles.map((a) => ({ title: a.title, href: `/articles/${a.slug}` }))
      : videos.map((v) => ({ title: v.title, href: v.videoUrl ?? "#" }));

  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} bg-paper text-ink`}>
        <Header breaking={breaking} siteName={settings?.siteName} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
