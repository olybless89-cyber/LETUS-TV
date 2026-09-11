import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getAllPollsForAdmin } from "@/lib/server-data";

const schema = z.object({
  question: z.string().min(1).max(300),
  options: z.array(z.string().min(1).max(120)).min(2).max(8),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const polls = await getAllPollsForAdmin();
  return NextResponse.json({ polls });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  // Only one active poll at a time on the homepage — deactivate others if this one is active.
  if (parsed.data.isActive) {
    await prisma.poll.updateMany({ data: { isActive: false } });
  }

  const poll = await prisma.poll.create({
    data: {
      question: parsed.data.question,
      isActive: parsed.data.isActive,
      options: {
        create: parsed.data.options.map((label, i) => ({ label, order: i })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json({ poll });
}
