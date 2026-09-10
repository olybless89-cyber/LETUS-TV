import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

export const AUTH_COOKIE = "letus_admin_token";
export const SESSION_DAYS = 7;

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "letus-tv-development-secret-change-me",
  );
}

export async function signSession(user: { id: string; email: string; role: string }) {
  return await new SignJWT({ role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: String(payload.sub),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? "AUTHOR"),
    };
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string; email: string; role: string }) {
  const token = await signSession(user);
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function destroySession() {
  (await cookies()).delete(AUTH_COOKIE);
}

