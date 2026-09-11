import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin — Letus TV",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} bg-[#0b1220] text-paper font-display`}>
        {children}
      </body>
    </html>
  );
}
