export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  // no JWT checks here—middleware will protect dashboard
  const res = NextResponse.json({ success: true }, { status: 200 });

  // set the onboarded flag for future set-token calls
  res.cookies.set("onboarded", "true", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });

  return res;
}
