"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const miniChartData = [
  { value: 10 },
  { value: 15 },
  { value: 12 },
  { value: 18 },
  { value: 16 },
  { value: 20 },
  { value: 18 },
];

interface TokenInfo {
  mint: string;
  amount: number;
  symbol: string;
  name: string;
  logo: string;
  priceUSD: number;
  valueUSD: number;
}

export default function BalanceCard() {
  const { user } = usePrivy();
  const [totalUSD, setTotalUSD] = useState<number>(0);

  const getSOLBalance = async (address: string) => {
    try {
      const response = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [address],
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        console.error("SOL fetch error:", data.error.message);
        return 0;
      }
    } catch (error) {
      console.error("getSOLBalance fetch error:", error);
      return 0;
    }
  };

  const getTokenAccounts = async (address: string) => {
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "getTokenAccountsByOwner",
          id: 1,
          params: [
            address,
            {
              programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            },
            {
              encoding: "jsonParsed",
            },
          ],
        }),
      }
    );
    const data = await response.json();
    return data.result.value;
  };

  const getTokenMetadata = async (mints: string[]) => {
    const response = await fetch(
      `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mintAccounts: mints,
          includeOffChain: true,
          disableCache: false,
        }),
      }
    );
    const data = await response.json();
    return data;
  };

  const getTokenPrices = async (mints: string[]) => {
    const prices: { [mint: string]: number } = {};
    for (const mint of mints) {
      try {
        const response = await fetch(
          `https://solana-gateway.moralis.io/token/mainnet/${mint}/price`,
          {
            headers: {
              accept: "application/json",
              "X-API-Key":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE1MjA0M2VjLWRjNmYtNGFiMy1iOWVmLTNkMTljMDI2OWM5MSIsIm9yZ0lkIjoiNDQ0NTI4IiwidXNlcklkIjoiNDU3MzYxIiwidHlwZUlkIjoiOWNjMThjOTAtZjAwOC00MGFkLWJlZWYtYTFjYTc2N2E1OTdlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDU5NjMwMzIsImV4cCI6NDkwMTcyMzAzMn0.5cu4ZPcVG_YCi57_-e5UTz7gJdmQ7ezZ-Jocru9A0Kw",
            },
          }
        );
        const data = await response.json();
        prices[mint] = data.usdPrice || 0;
      } catch {
        prices[mint] = 0;
      }
    }
    return prices;
  };

  const fetchData = async () => {
    if (!user?.wallet?.address) return;
    const address = user.wallet.address;

    const sol = await getSOLBalance(address);
    const tokenAccounts = await getTokenAccounts(address);

    const filteredTokens = tokenAccounts.filter(
      (t: {
        account: {
          data: { parsed: { info: { tokenAmount: { uiAmount: number } } } };
        };
      }) => t.account.data.parsed.info.tokenAmount.uiAmount > 0
    );

    const mints = filteredTokens.map(
      (t: {
        account: {
          data: { parsed: { info: { mint: string } } };
        };
      }) => t.account.data.parsed.info.mint
    );

    const metadata = await getTokenMetadata(mints);
    const prices = await getTokenPrices(mints);

    const tokensData: TokenInfo[] = filteredTokens.map(
      (t: {
        account: {
          data: {
            parsed: {
              info: {
                mint: string;
                tokenAmount: { uiAmount: number };
              };
            };
          };
        };
      }) => {
        const mint = t.account.data.parsed.info.mint;
        const amount = t.account.data.parsed.info.tokenAmount.uiAmount;
        const meta = metadata.find((m: { mint: string }) => m.mint === mint);
        const priceUSD = prices[mint] || 0;
        return {
          mint,
          amount,
          symbol: meta?.symbol || "TKN",
          name: meta?.name || "Unknown Token",
          logo: meta?.image || "",
          priceUSD,
          valueUSD: amount * priceUSD,
        };
      }
    );

    const solPrice = await getTokenPrices([
      "So11111111111111111111111111111111111111112",
    ]);
    const solValueUSD =
      (sol ?? 0) *
      (solPrice["So11111111111111111111111111111111111111112"] || 0);

    // Removed setTokens as 'tokens' state is no longer used
    setTotalUSD(
      tokensData.reduce((acc, token) => acc + token.valueUSD, 0) + solValueUSD
    );
  };

  useEffect(() => {
    fetchData();
  }, [user?.wallet?.address, fetchData]);

  return (
    <div className="border-white/10 rounded-xl p-6 border col-span-1">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">Balance</h2>
        <ArrowUpRight className="h-5 w-5 text-gray-500" />
      </div>
      <div className="mt-4">
        <h1 className="text-2xl font-bold">${totalUSD.toFixed(2)}</h1>
        <div className="flex items-center mt-2">
          <div className="flex items-center text-emerald-400">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>92.68%</span>
          </div>
        </div>
      </div>
      <div className="mt-6 h-32 relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={miniChartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="rgb(16, 185, 129)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
