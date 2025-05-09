import { NextRequest, NextResponse } from "next/server";

const API_TOKEN = "a87d14078537c40c966c25a609668534cae6ffc8";
const BASE = "https://cryptopanic.com/api/v1";

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit") || "10";
  const currencies = req.nextUrl.searchParams.get("currencies") || "";
  const params = new URLSearchParams({
    auth_token: API_TOKEN,
    public: "true",
    filter: "rising",
    limit,
  });
  if (currencies) params.set("currencies", currencies);

  const url = `${BASE}/posts/?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
