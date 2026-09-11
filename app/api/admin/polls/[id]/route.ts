import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({ isActive: z.boolean() });

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (parsed.data.isActive) {
    await prisma.poll.updateMany({ data: { isActive: false } });
  }

  const poll = await prisma.poll.update({
    where: { id },
    data: { isActive: parsed.data.isActive },
  }).catch(() => null);

  if (!poll) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ poll });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.poll.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
