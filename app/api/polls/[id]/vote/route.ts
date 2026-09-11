import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getRequestIpHash } from "@/lib/ip";

const schema = z.object({ optionId: z.string().min(1) });

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id: pollId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  if (!poll || !poll.isActive) {
    return NextResponse.json({ error: "This poll is not active." }, { status: 404 });
  }

  const option = await prisma.pollOption.findFirst({ where: { id: parsed.data.optionId, pollId } });
  if (!option) {
    return NextResponse.json({ error: "Invalid option." }, { status: 400 });
  }

  const ipHash = await getRequestIpHash();
  if (ipHash) {
    const existing = await prisma.pollVote.findFirst({ where: { pollId, ipHash } });
    if (existing) {
      return NextResponse.json({ error: "You've already voted on this poll." }, { status: 409 });
    }
  }

  await prisma.$transaction([
    prisma.pollOption.update({ where: { id: option.id }, data: { votes: { increment: 1 } } }),
    prisma.pollVote.create({ data: { pollId, optionId: option.id, ipHash } }),
  ]);

  const updated = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ poll: updated });
}
