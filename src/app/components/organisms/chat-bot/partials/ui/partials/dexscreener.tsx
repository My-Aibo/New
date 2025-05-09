// import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// Types
interface DexScreenerOrder {
  type: "tokenProfile" | "communityTakeover" | "tokenAd" | "trendingBarAd";
  status: "processing" | "cancelled" | "on-hold" | "approved" | "rejected";
  paymentTimestamp: number;
}

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
  boosts?: {
    active: number;
  };
}

// interface DexScreenerPairResponse {
//   schemaVersion: string;
//   pairs: DexScreenerPair[];
// }

// Types for Token Profiles
interface DexScreenerTokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  openGraph?: string;
  description?: string;
  links?: DexScreenerTokenProfileLink[];
}

interface DexScreenerTokenProfileLink {
  type?: string;
  label?: string;
  url: string;
}

const OrdersResult = ({ orders }: { orders: DexScreenerOrder[] }) => {
  if (!orders.length) {
    return (
      <div className="bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          No, this token hasn&apos;t paid for any DexScreener promotional
          services. This means they haven&apos;t invested in marketing features
          like token profile promotion or community takeover on DexScreener.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-muted/50 p-4">
      <h3 className="text-lg font-medium">Token Orders</h3>
      <div className="space-y-3">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-background/50 p-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{order.type}</span>
                <div>{order.status}</div>
              </div>
              {order.paymentTimestamp > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Paid at:{" "}
                  {new Date(order.paymentTimestamp * 1000).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TokenProfile = ({
  pair,
}: {
  pair: { price?: number; address?: string };
}) => {
  const [showChart, setShowChart] = useState(false);
  const { price, address } = pair;

  const iframeSrc = [
    `https://birdeye.so/tv-widget/${pair.address}`,
    `?chain=solana`,
    `&viewMode=pair`,
    `&chartInterval=15`,
    `&chartType=CANDLE`,
    `&chartLeftToolbar=show`,
    `&theme=dark`,
    `&cssCustomProperties=--tv-color-pane-background:%23000000`,
    `&cssCustomProperties=--tv-color-platform-background:%23000000`,
    `&chartOverrides=paneProperties.backgroundType:gradient`,
    `&chartOverrides=paneProperties.background:#000000`,
    `&chartOverrides=paneProperties.backgroundGradientStartColor:#000000`,
    `&chartOverrides=paneProperties.backgroundGradientEndColor:#000000FF`,
  ].join("");
  if (!pair) {
    return (
      <div className="bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          Token not found or no data available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-muted/50 p-4">
      {/* 🔹 Clickable Price Card */}
      <div
        className="rounded-lg bg-background/50 p-3 cursor-pointer hover:bg-background/70 transition"
        onClick={() => setShowChart((v) => !v)}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Price USD</span>
          <span className="text-xs text-muted-foreground">
            {showChart ? "Hide chart" : "Show chart"}
          </span>
        </div>
        <div className="mt-1 text-2xl font-semibold">
          ${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </div>
      </div>

      {/* 🔹 Birdeye iframe chart */}
      {showChart && (
        <div className="w-full h-[600px] border border-gray-700 rounded overflow-hidden">
          <iframe
            src={iframeSrc}
            className="w-full h-full border-0"
            allow="fullscreen"
            title={`Birdeye chart for ${address}`}
          />
        </div>
      )}

      {/* 🔹 Mint Address */}
      <div className="rounded-lg bg-background/50 p-3">
        <div className="text-sm font-medium">Mint Address</div>
        <div className="mt-1 font-mono text-sm">
          {address.slice(0, 6)}…{address.slice(-6)}
        </div>
      </div>
    </div>
  );
};

const TokenProfiles = ({
  profiles,
}: {
  profiles: DexScreenerTokenProfile[];
}) => {
  const solanaProfiles = profiles.filter(
    (profile) => profile.chainId === "solana"
  );

  if (!solanaProfiles.length) {
    return (
      <div className="bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          No Solana token profiles found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {solanaProfiles.map((profile, index) => (
        <div key={index} className="bg-muted/50">
          <div className="bg flex flex-col p-2">
            <div className="flex gap-3">
              {profile.icon && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={profile.icon}
                    alt="Token Icon"
                    className="object-cover w-[64px] h-[64px]"
                    sizes="64px"
                    onError={(e) => {
                      // @ts-expect-error - Type 'string' is not assignable to type 'never'
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-muted-foreground">
                    {profile.tokenAddress.slice(0, 4)}...
                    {profile.tokenAddress.slice(-4)}
                  </code>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                  >
                    DexScreener
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
                <div className="h-12 overflow-hidden py-1">
                  {profile.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {profile.description}
                    </p>
                  )}
                </div>
                {profile.links &&
                  (profile.links.length <= 2 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.links.map((link, idx) => (
                        <LinkChip key={idx} link={link} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                      {/* <LinkChip link={profile.links[0]} />
                      <div delayDuration={0}>
                        <div>
                          <TooltipTrigger asChild>
                            <div className="inline-flex cursor-default items-center rounded-md bg-background px-1.5 py-0.5 text-xs">
                              +{profile.links.length - 1} more
                              <MoreHorizontal className="ml-1 h-3 w-3" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="flex flex-col gap-1 p-2">
                            {profile.links.slice(1).map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs capitalize hover:text-accent"
                              >
                                {getLinkText(link)}
                                <ExternalLink className="ml-1 h-2.5 w-2.5" />
                              </a>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider> */}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LinkChip = ({ link }: { link: DexScreenerTokenProfileLink }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-md bg-background px-1.5 py-0.5 text-xs capitalize hover:bg-accent"
  >
    {getLinkText(link)}
    <ExternalLink className="ml-1 h-2.5 w-2.5" />
  </a>
);

const getLinkText = (link: DexScreenerTokenProfileLink) =>
  link.type ? link.type.replace(/-/g, " ") : link.label ? link.label : "Link";

export const dexscreenerTools = {
  getTokenOrders: {
    displayName: "🔍 Check Token Orders",
    description:
      "Check if a token has paid for DexScreener promotional services. Use this to verify if a token has invested in marketing or visibility on DexScreener, which can indicate the team's commitment to marketing and visibility. Returns order types (tokenProfile, communityTakeover, etc.) and their statuses.",
    parameters: z.object({
      chainId: z
        .string()
        .describe("The blockchain identifier (e.g., 'solana', 'ethereum')"),
      tokenAddress: z.string().describe("The token address to check"),
    }),
    execute: async ({
      chainId,
      tokenAddress,
    }: {
      chainId: string;
      tokenAddress: string;
    }) => {
      try {
        const response = await fetch(
          `https://api.dexscreener.com/orders/v1/${chainId}/${tokenAddress}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch token orders: ${response.statusText}`
          );
        }

        const orders = (await response.json()) as DexScreenerOrder[];
        return {
          suppressFollowUp: true,
          data: orders,
        };
      } catch (error) {
        throw new Error(
          `Failed to get token orders: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    render: (raw: unknown) => {
      const result = (raw as { data: DexScreenerOrder[] }).data;
      return <OrdersResult orders={result} />;
    },
  },
  getTokenProfile: {
    displayName: "📊 Token Profile",
    description:
      "Get comprehensive information about a token from DexScreener. Use this when users want to know more about a token, including its price, liquidity, market cap, and social links (Telegram, Twitter, Website). This is particularly useful for due diligence or when users ask about token details, social presence, or market metrics.",
    parameters: z.object({
      pairAddress: z.string().describe("The token/pair address to check"),
    }),
    execute: async ({ pairAddress }: { pairAddress: string }) => {
      console.log("Fetching token profile for address:", pairAddress);

      const resp = await fetch(
        `https://public-api.birdeye.so/defi/price?address=${encodeURIComponent(
          pairAddress
        )}`,
        {
          headers: {
            Accept: "application/json",
            "x-chain": "solana",
            "X-API-KEY": "d6ad78fcb7f24dacae1f53a4acb689d4",
          },
        }
      );
      if (!resp.ok) {
        throw new Error(`Birdeye price fetch failed: ${resp.statusText}`);
      }
      const priceData = (await resp.json()) as any;
      if (!priceData.data?.value) {
        throw new Error("Birdeye returned no price");
      }
      return {
        suppressFollowUp: true,
        data: {
          price: priceData.data.value,
          address: pairAddress,
        },
      };
    },
    render: (raw: unknown) => {
      const result = (raw as { data: DexScreenerPair }).data;
      return <TokenProfile pair={result} />;
    },
  },
  getLatestTokenProfiles: {
    displayName: "🌟 Latest Token Profiles",
    description:
      "Get the latest token profiles from DexScreener, focusing on Solana tokens. This shows tokens with verified profiles including their descriptions, social links, and branding assets.",
    parameters: z.object({
      placeholder: z.string().optional(),
    }),
    execute: async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/token-profiles/latest/v1",
          {
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch token profiles: ${response.statusText}`
          );
        }

        const profiles = (await response.json()) as DexScreenerTokenProfile[];

        // Return up to first 10 profiles for Solana
        const solanaProfiles = profiles
          .filter((p) => p.chainId === "solana")
          .slice(0, 10);

        return {
          suppressFollowUp: true,
          data: solanaProfiles,
        };
      } catch (error) {
        throw new Error(
          `Failed to get token profiles: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    render: (raw: unknown) => {
      const result = (raw as { data: DexScreenerTokenProfile[] }).data;
      return <TokenProfiles profiles={result} />;
    },
  },
};
