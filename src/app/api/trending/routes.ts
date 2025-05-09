export async function GET() {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs");
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Dexscreener" }),
      { status: 500 }
    );
  }
}
