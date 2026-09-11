import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/server-data";

const schema = z.object({
  siteName: z.string().min(1).max(120),
  tagline: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  contactEmail: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(60).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  facebookUrl: z.string().url().optional().nullable().or(z.literal("")),
  instagramUrl: z.string().url().optional().nullable().or(z.literal("")),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal("")),
  tiktokUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
  conversationCtaEnabled: z.boolean().default(false),
  conversationCtaHeading: z.string().max(200).optional().nullable(),
  conversationCtaText: z.string().max(500).optional().nullable(),
  conversationCtaUrl: z.string().url().optional().nullable().or(z.literal("")),
  conversationCtaButtonText: z.string().max(60).optional().nullable(),
  audioRoomsEnabled: z.boolean().default(false),
  audioRoomsHeading: z.string().max(200).optional().nullable(),
  audioRoomsText: z.string().max(500).optional().nullable(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const existing = await getSiteSettings();
  const data = {
    siteName: parsed.data.siteName,
    tagline: parsed.data.tagline || "Let's Watch. Let's Know. Let's Connect.",
    description: parsed.data.description || null,
    contactEmail: parsed.data.contactEmail || null,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
    facebookUrl: parsed.data.facebookUrl || null,
    instagramUrl: parsed.data.instagramUrl || null,
    youtubeUrl: parsed.data.youtubeUrl || null,
    tiktokUrl: parsed.data.tiktokUrl || null,
    twitterUrl: parsed.data.twitterUrl || null,
    conversationCtaEnabled: parsed.data.conversationCtaEnabled,
    conversationCtaHeading: parsed.data.conversationCtaHeading || null,
    conversationCtaText: parsed.data.conversationCtaText || null,
    conversationCtaUrl: parsed.data.conversationCtaUrl || null,
    conversationCtaButtonText: parsed.data.conversationCtaButtonText || null,
    audioRoomsEnabled: parsed.data.audioRoomsEnabled,
    audioRoomsHeading: parsed.data.audioRoomsHeading || null,
    audioRoomsText: parsed.data.audioRoomsText || null,
  };

  const settings = existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
    : await prisma.siteSettings.create({ data });

  return NextResponse.json({ settings });
}
