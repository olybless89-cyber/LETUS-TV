import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getLiveStreamSettings } from "@/lib/server-data";

const schema = z.object({
  streamUrl: z.string().url().optional().nullable().or(z.literal("")),
  streamType: z.enum(["HLS", "YOUTUBE", "EMBED", "EXTERNAL"]),
  title: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable().or(z.literal("")),
  isLive: z.boolean().default(false),
  isVisible: z.boolean().default(true),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getLiveStreamSettings();
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

  const existing = await getLiveStreamSettings();
  const data = {
    streamUrl: parsed.data.streamUrl || null,
    streamType: parsed.data.streamType,
    title: parsed.data.title || null,
    description: parsed.data.description || null,
    thumbnailUrl: parsed.data.thumbnailUrl || null,
    isLive: parsed.data.isLive,
    isVisible: parsed.data.isVisible,
  };

  const settings = existing
    ? await prisma.liveStreamSettings.update({ where: { id: existing.id }, data })
    : await prisma.liveStreamSettings.create({ data });

  return NextResponse.json({ settings });
}
