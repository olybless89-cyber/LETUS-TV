import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getActiveBreakingNews, getSiteSettings } from "@/lib/server-data";

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
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [breaking, settings] = await Promise.all([
    getActiveBreakingNews().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

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
