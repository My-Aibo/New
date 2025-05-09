// ─── src/app/api/set-token/route.ts ───
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
    console.log("/api/set-token body:", body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : null;
  if (!token) {
    console.error("❌ Missing token");
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  // See if they've already finished onboarding
  const cookies = request.headers.get("cookie") || "";
  const already = cookies
    .split("; ")
    .some((cookie) => cookie.startsWith("onboarded=true"));

  // Return { onboarded } and set cookies
  const res = NextResponse.json({ onboarded: already });
  res.cookies.set("privy-token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 1 week
  });
  if (already) {
    res.cookies.set("onboarded", "true", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  return res;
}
