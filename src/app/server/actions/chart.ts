import { TIMEFRAME } from "@/app/components/organisms/chat-bot/partials/types/chart";
import { z } from "zod";

// ── Schemas ───────────────────────────────────────────────────────────────────
const tokenSchema = z.object({ id: z.string() });
const priceHistorySchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
});

// DexScreener candles have this shape:
const dexCandleSchema = z.object({
  startTime: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
});
type DexCandle = z.infer<typeof dexCandleSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────
function mapTimeframeToCgInterval(tf: TIMEFRAME) {
  switch (tf) {
    case TIMEFRAME.DAYS:
      return "daily";
    case TIMEFRAME.HOURS:
      return "hourly";
    default:
      return "hourly";
  }
}
function mapTimeframeToDexInterval(tf: TIMEFRAME) {
  switch (tf) {
    case TIMEFRAME.MINUTES:
      return "1m";
    case TIMEFRAME.HOURS:
      return "1h";
    case TIMEFRAME.DAYS:
      return "1d";
    default:
      return "1m";
  }
}

// ── CoinGecko (public API) ───────────────────────────────────────────────────

const CG_BASE = "https://api.coingecko.com/api/v3";

async function getTokenId(
  contractAddress: string,
  network: string = "solana"
): Promise<string> {
  // e.g. GET /coins/solana/contract/{contractAddress}
  const res = await fetch(
    `${CG_BASE}/coins/${network}/contract/${contractAddress}`
  );
  if (!res.ok) throw new Error(`CG: failed to lookup token ID`);
  const payload = await res.json();
  return tokenSchema.parse({ id: payload.id }).id;
}

async function getPriceHistoryFromCG(
  tokenId: string,
  timeFrame: TIMEFRAME = TIMEFRAME.DAYS,
  timeDelta: number = 7
): Promise<{ time: number; value: number }[]> {
  // NO MORE `interval=` on free tier
  const url = `${CG_BASE}/coins/${tokenId}/market_chart?vs_currency=usd&days=${timeDelta}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CG: failed to fetch market_chart`);
  const { prices } = await res.json();
  return prices.map(([t, v]: [number, number]) => ({ time: t, value: v }));
}

// ── DexScreener (public, no key) ──────────────────────────────────────────────

async function getTopPoolAddress(
  contractAddress: string,
  chain: "solana" | "ethereum" | "bsc" = "solana"
): Promise<string> {
  // GET latest pairs for this token
  const res = await fetch(
    `https://api.dexscreener.io/latest/dex/pairs/${chain}/${contractAddress}`
  );
  if (!res.ok) throw new Error(`DexScreener: no pairs found`);
  const { pairs } = await res.json();
  if (!pairs?.length) throw new Error(`DexScreener: empty pairs array`);
  return pairs[0].pairAddress as string;
}

async function getDexPriceHistory(
  contractAddress: string,
  network: "solana" | "ethereum" | "bsc" = "solana",
  timeFrame: TIMEFRAME = TIMEFRAME.MINUTES,
  limit: number = 500
): Promise<{ time: number; value: number }[]> {
  const poolAddr = await getTopPoolAddress(contractAddress, network);
  const interval = mapTimeframeToDexInterval(timeFrame);
  // GET candles
  const res = await fetch(
    `https://api.dexscreener.com/candles/${network}/${poolAddr}?interval=${interval}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`DexScreener: failed to fetch candles`);
  const data: unknown[] = await res.json();
  return data.map((raw) => {
    const c = dexCandleSchema.parse(raw);
    return { time: c.startTime, value: c.close };
  });
}

// ── Unified getPriceHistory ──────────────────────────────────────────────────
export async function getPriceHistory(
  contractAddress: string,
  network: "solana" | "ethereum" | "bsc" = "solana",
  timeFrame: TIMEFRAME = TIMEFRAME.DAYS,
  timeDelta: number = 7
): Promise<{ time: number; value: number }[]> {
  try {
    // first try the CoinGecko historical price
    const tokenId = await getTokenId(contractAddress, network);
    return await getPriceHistoryFromCG(tokenId, timeFrame, timeDelta);
  } catch {
    // fallback to pool‑based on‑chain OHLCV
    return await getDexPriceHistory(contractAddress, network, timeFrame);
  }
}
