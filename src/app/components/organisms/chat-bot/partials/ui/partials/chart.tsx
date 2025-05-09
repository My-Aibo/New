// ui/partials/chart.tsx

import React from "react";
import { z } from "zod";
import { resolveMintParam } from "../../utils/tokenRegistry";

export const chartToolParameters = z.object({
  chain: z.string(),
  contractAddress: z.string(),
  tokenSymbol: z.string(),
});

function renderEmbed(
  result: {
    success: boolean;
    tokenInfo?: { address: string; symbol: string };
    error?: string;
  },
  params: z.infer<typeof chartToolParameters>
) {
  if (!result.success) {
    return <div className="p-4 text-red-400">Something went wrong</div>;
  }
  console.log("Rendering chart with result:", result);
  const { address, symbol } = result.tokenInfo!;
  const src = `https://dexscreener.com/solana/${address}?embed=1&theme=dark`;

  return (
    <div className="p-4">
      <h3 className="mb-2 font-medium">{symbol} Price Chart</h3>
      <div className="w-full h-[650px] border border-gray-700 rounded overflow-hidden">
        <iframe
          src={src}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-popups "
          frameBorder="0"
          title={`${symbol} chart`}
        />
      </div>
    </div>
  );
}

export const chartTools = {
  chartTool: {
    displayName: "📈 Chart",
    description: "Embed a DexScreener chart by symbol or address.",
    isCollapsible: true,
    isExpandedByDefault: true,
    parameters: chartToolParameters,

    execute: async (params: z.infer<typeof chartToolParameters>) => {
      const resolved = await resolveMintParam({
        symbol: params.tokenSymbol,
        tokenAddress: params.contractAddress,
      });
      if (!resolved) {
        return { success: false, error: "Token not found" };
      }
      return {
        success: true,
        tokenInfo: { address: resolved.address, symbol: resolved.symbol },
      };
    },

    render: (result: any, params: z.infer<typeof chartToolParameters>) =>
      renderEmbed(result, params),
  },
};
