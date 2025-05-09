import { z } from "zod";
import { birdeyeTools } from "../ui/birdeye";
import { dexscreenerTools } from "../ui/partials/dexscreener";
import { definedTools } from "../ui/partials/defined-fi";
import { bundleTools } from "../ui/partials/bundle";
import { sniperTools } from "../ui/partials/sniper";
import { topTokenHolders } from "../ui/partials/topholders";
import { cookietools } from "../ui/partials/cookie";
import { chartTools } from "../ui/partials/chart";
import { cryptoPanicTools } from "../ui/partials/cryptopanic";
// import { privyTools } from "../ui/partials/pumpfun";

export interface ToolConfig<T = unknown, R = unknown> {
  displayName?: string;
  icon?: ReactNode;
  isCollapsible?: boolean;
  isExpandedByDefault?: boolean;
  description: string;
  parameters: z.ZodType<T>;
  execute?: (params: T) => Promise<R>;
  render?: (result: R) => React.ReactNode | null;
  agentKit?: T;
  userId?: T;
  requiresConfirmation?: boolean;
  requiredEnvVars?: string[];
}

export const defaultSystemPrompt = `
You are Neur, a smart Solana DeFi assistant. When you need to fetch on-chain analytics or wallet operations, you must reply with ONLY a JSON object indicating which tool to call and with exactly which params. You support:


// Use filterTrendingTokens when the user asks for:
// - trending tokens
// - hot new tokens
// - tokens created in the last 48 hours
// - top gainers / top movers
// - newly launched coins

// Use getCryptoPanicPosts when the user asks for:
// - latest crypto news
// - recent posts
// - fetching news headlines

// Use analyzeBundles when the user asks for:
// - bundle analysis
// - sniper detection
// - trench analysis
// - wallet bundling activity
// - sniper wallet behavior

// Use sniperBundle when the user asks for:
// - sniper wallets only
// - sniper-only analysis
// - show only snipers
// - sniper wallet detection

// Use topTokenHolders when the user asks for:
// - whale wallets
// - large holders
// - top token holders
// - biggest holders of a token
// - wallets with more than or less than X%
// - holders below X percent
// - show me holders of token XYZ

// Use chartTool when the user asks for:
// - show me the chart for XYZ
// - chart for token ABC

// use getTokenProfile when the user asks for:
// - token profile
// - token price


1. Top traders (Solana DEXes):
{
  "tool": "getTopTraders",
  "params": { "timeframe": "today" }
}

2. DexScreener token orders:
{
  "tool": "getTokenOrders",
  "params": {
    "chainId": "solana",
    "tokenAddress": "So11111111111111111111111111111111111111112"
  }
}

3. DexScreener token profile:
{
  "tool": "getTokenProfile",
  "params": {
  "pairAddress": "<pair-address>"
  }
}

// 4. Latest Solana token profiles on DexScreener:
{
  "tool": "getLatestTokenProfiles",
  "params": {}
}

// 5. Filter and discover trending tokens:
{
  "tool": "filterTrendingTokens",
  "params": {
    "minVolume24h": 10000,
    "maxVolume24h": 10000000,
    "minLiquidity": 10000,
    "maxLiquidity": 5000000,
    "minMarketCap": 100000,
    "maxMarketCap": 50000000,
    "createdWithinHours": 48,
    "sortBy": "trendingScore24",
    "sortDirection": "DESC",
    "limit": 10
  }
}

// 6. Analyze token bundles:
{
  "tool": "analyzeBundles",
  "params": {
    "mintAddress": "<mint-address>"
  }
}

// 7. Detect sniper wallets from a token:
{
  "tool": "sniperBundle",
  "params": {
    "mintAddress": "<mint-address>"
  }
}

// 8. Detect holders of a token:
{
  "tool": "topTokenHolders",
  "params": {
    "mintAddress": "<mint-address>",
    "minPercent": 2
  }
}

// 9. Show me the chart for XYZ:
{
  "tool": "chartTool",
  "params": {
    "chain": "solana",
    "contractAddress": "<contract-address>",
    "tokenSymbol": "<symbol>"
  }
}

// 10. Fetch trending crypto news:
{
  "tool": "getCryptoPanicTrending",
  "params": {
    "limit": 5,
    "currencies": "BTC,ETH"
  }
}


Do NOT add any extra keys.
Do NOT wrap in <think>.
Do NOT explain.
Only output raw JSON.
`;

export const defaultTools: Record<string, ToolConfig<any, unknown>> = {
  ...birdeyeTools,
  ...dexscreenerTools,
  ...definedTools,
  ...bundleTools,
  ...sniperTools,
  ...topTokenHolders,
  ...cookietools,
  ...chartTools,
  ...cryptoPanicTools,
};

export const toolsets: Record<
  string,
  { tools: string[]; description: string }
> = {
  traderTools: {
    tools: ["birdeyeTools"],
    description:
      "Tools for analyzing and tracking traders and trades on Solana DEXes.",
  },
  defiTools: {
    tools: ["dexscreenerTools"],
    description:
      "Tools for interacting with DeFi protocols on Solana, including swaps, market data, token information and details.",
  },
  financeTools: {
    tools: ["definedTools"],
    description:
      "Tools for retrieving and applying logic to static financial data, including analyzing trending tokens.",
  },
  bundleTools: {
    tools: ["bundleTools"],
    description:
      "Tools to analyze potential bundles and snipers for a contracts.",
  },
  sniperTools: {
    tools: ["sniperBundle"],
    description: "Tools for detecting sniper wallets from on-chain activity.",
  },
  topTokenHolders: {
    tools: ["topTokenHolders"],
    description: "Tools for identifying top holders (whales) of a token.",
  },
  // cookieTools: {
  //   tools: [
  //     "getAgentDetailsFromAddress",
  //     "getAgentFromSearch",
  //     "getTrendingAgents",
  //     "searchTweets",
  //   ],
  //   description:
  //     "Tools to interact with Solana AI agents and track their social impact.",
  // },
  chartTools: {
    tools: ["chartTool"],
    description: "Tools for generating and displaying charts.",
  },
  newsTools: {
    tools: ["getCryptoPanicPosts", "getCryptoPanicTrending"],
    description: "Fetch latest or trending crypto news from CryptoPanic.",
  },
};

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}
