import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  }).catch(() => null);

  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
