import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { z } from "zod";
import { getMintAccountInfo } from "../../hooks/helius";
import { formatNumber } from "../../utils/formatnumber";
import { fetchHelius } from "../../hooks/helius";

export const topTokenHolders = {
  topTokenHolders: {
    displayName: "🐋 Detect Top Token Holders",
    isCollapsible: true,
    isExpandedByDefault: false,
    description:
      "Detect top token holders for a given mint address. This tool identifies wallets that hold a significant percentage of the total supply of a token, which can indicate potential whale activity or large holders. The results are sorted by the percentage of supply held. You can set a minimum percentage to filter out smaller holders.",
    parameters: z.object({
      mintAddress: z.string().describe("Token mint address."),
      minPercent: z
        .number()
        .default(1)
        .describe("Minimum % of supply to consider as holders."),
    }),
    execute: async ({
      mintAddress,
      minPercent,
    }: {
      mintAddress: string;
      minPercent: number;
    }) => {
      try {
        const mintInfo = await getMintAccountInfo(mintAddress);
        console.log("here", mintAddress);

        const totalSupply = Number(mintInfo.supply) / 10 ** mintInfo.decimals;

        const response = await fetchHelius("getTokenLargestAccounts", [
          encodeURIComponent(mintAddress),
        ]);
        const accounts = response?.result?.value || [];

        const whales = accounts
          .map((acc: { address: string; amount: string }) => {
            const amount = Number(acc.amount) / 10 ** mintInfo.decimals;
            const percent = (amount / totalSupply) * 100;
            return {
              address: acc.address,
              amount,
              percent,
            };
          })
          .filter((w) => w.percent >= minPercent) // e.g., 0.1 for low caps
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 10); // return top 10 after filtering

        return {
          success: true,
          data: {
            mintAddress,
            whales,
          },
        };
      } catch (error) {
        console.error("[whaleDetector] Error:", error);
        return {
          success: false,
          error:
            "We encountered an error while fetching whale data. Please ensure the mint address is valid.",
        };
      }
    },

    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: {
          mintAddress: string;
          whales: {
            address: string;
            amount: number;
            percent: number;
          }[];
        };
        error?: string;
      };

      if (!typedResult.success || !typedResult.data) {
        return (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-red-500">
              {typedResult.error || "Unable to load whale data."}
            </p>
          </div>
        );
      }

      const { whales, mintAddress } = typedResult.data;

      if (whales.length === 0) {
        return (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              🚫 No holders detected for {mintAddress} above the set threshold.
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {/* Summary Header */}
          <div className="rounded-lg bg-muted p-4">
            <div className="mx-auto flex flex-col gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Detected Holders</p>
                <p className="font-medium">{whales.length}wallets</p>
              </div>
              <div>
                <p className="text-muted-foreground">Source</p>
                <Link
                  href={`https://solscan.io/token/${mintAddress}`}
                  target="_blank"
                  className="inline-flex items-center"
                >
                  Solscan
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Whale Wallets */}
          <div className="rounded-lg bg-muted p-4 space-y-4">
            <h3 className="text-md font-semibold">🐋 Top Wallets</h3>
            <div className="grid gap-3 text-sm">
              {whales.map((w) => (
                <div
                  key={w.address}
                  className="p-3 rounded border bg-muted/50 space-y-1"
                >
                  <div className="truncate font-mono text-blue-500">
                    <Link
                      href={`https://solscan.io/account/${w.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {w.address}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span>Held Tokens:</span>
                    <span>{formatNumber(w.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>% of Supply:</span>
                    <span>{w.percent.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
  },
};
