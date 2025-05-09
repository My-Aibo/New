import { z } from "zod";
import { analyzeMintBundles } from "@/app/server/actions/bundle";

export const sniperTools = {
  sniperBundle: {
    displayName: "🎯 Detect Sniper Wallets",
    isCollapsible: true,
    isExpandedByDefault: false,
    description:
      "Returns wallets labeled as 'sniper' from bundle analysis for a given mint address.",
    parameters: z.object({
      mintAddress: z.string().describe("The token's mint address"),
    }),
    execute: async ({ mintAddress }: { mintAddress: string }) => {
      try {
        const analysis = await analyzeMintBundles({ mintAddress });

        if (!analysis?.data || !analysis.data.data?.bundles) {
          return {
            success: false,
            error:
              "Unable to fetch sniper data. Please ensure it's a valid pump.fun token.",
          };
        }

        const sniperWallets: { wallet: string; info: any; bundleId: string }[] =
          [];

        const bundles = analysis.data.data.bundles;
        for (const [bundleId, bundle] of Object.entries(bundles)) {
          for (const [wallet, category] of Object.entries(
            bundle.wallet_categories || {}
          )) {
            if (category === "sniper") {
              const info = bundle.wallet_info?.[wallet];
              if (info) {
                sniperWallets.push({ wallet, info, bundleId });
              }
            }
          }
        }

        return {
          success: true,
          data: {
            mintAddress,
            sniperWallets,
          },
        };
      } catch (error) {
        console.error("[sniperBundle] Unexpected error:", error);
        return {
          success: false,
          error:
            "An error occurred while detecting snipers. Please try again later.",
        };
      }
    },

    render: (result: unknown) => {
      const typedResult = result as {
        success: boolean;
        data?: {
          mintAddress: string;
          sniperWallets: {
            wallet: string;
            info: {
              tokens: number;
              sol: number;
              sol_percentage: number;
              token_percentage: number;
            };
            bundleId: string;
          }[];
        };
        error?: string;
      };

      if (!typedResult.success || !typedResult.data) {
        return (
          <div className="relative overflow-hidden rounded-2xl bg-muted p-4">
            <p className="text-sm text-red-500">
              {typedResult.error ||
                "Unable to load sniper data. Please try again."}
            </p>
          </div>
        );
      }

      const { sniperWallets, mintAddress } = typedResult.data;

      if (sniperWallets.length === 0) {
        return (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              🚫 No sniper wallets detected for {mintAddress}.
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="text-md font-semibold mb-4">
              🎯 Sniper Wallets Detected ({sniperWallets.length})
            </h3>
            <div className="grid gap-4 text-sm">
              {sniperWallets.map(({ wallet, info, bundleId }) => (
                <div
                  key={`${wallet}-${bundleId}`}
                  className="p-3 rounded border bg-muted/50 space-y-1"
                >
                  <div className="font-mono truncate text-blue-500">
                    <a
                      href={`https://solscan.io/account/${wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {wallet}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span>Bundle ID:</span>
                    <span className="text-muted-foreground">{bundleId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tokens:</span>
                    <span>
                      {info.tokens.toLocaleString()} (
                      {info.token_percentage.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SOL Spent:</span>
                    <span>
                      {info.sol.toFixed(2)} SOL (
                      {info.sol_percentage.toFixed(2)}%)
                    </span>
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
