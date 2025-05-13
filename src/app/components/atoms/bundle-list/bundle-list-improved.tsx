"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  LocateFixed,
} from "lucide-react";
import {
  BundleAnalysisResponse,
  BundleDetails,
} from "../../organisms/chat-bot/partials/types/types.bundle";
import { formatNumber } from "../../organisms/chat-bot/partials/utils/formatnumber";
import { CopyableText } from "../copyable-text/copyable-text";

interface BundleListProps {
  bundles: BundleAnalysisResponse["bundles"];
}

function BundleCard({
  bundle,
  index,
}: {
  bundle: BundleDetails;
  index: number;
}) {
  const stats = [
    { name: "Unique Wallets", value: bundle.unique_wallets },
    { name: "Total Tokens", value: formatNumber(bundle.total_tokens) },
    { name: "Total SOL Spent", value: `${formatNumber(bundle.total_sol)} SOL` },
    {
      name: "Token Percentage",
      value: `${bundle.token_percentage.toFixed(2)}%`,
    },
    {
      name: "Holding Percentage",
      value: `${bundle.holding_percentage.toFixed(2)}%`,
    },
    { name: "Holding Amount", value: formatNumber(bundle.holding_amount) },
  ];

  return (
    <div className="w-full">
      <div>
        <div className="text-center text-xl">Bundle {index + 1}</div>
      </div>
      <div className="space-y-6">
        {/* Bundle Stats */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {stats.map(({ name, value }) => (
            <div
              key={name}
              className="space-y-1 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/80"
            >
              <p className="text-sm text-muted-foreground">{name}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Wallet Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Wallet Information</h3>
          <div className="grid gap-3">
            {Object.entries(bundle.wallet_info).map(
              ([wallet, info]: [string, { tokens: number; token_percentage: number; sol: number; sol_percentage: number }]) => (
                <div key={wallet} className="overflow-hidden rounded-lg border border-border/50">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="truncate text-left text-sm font-medium">
                        <CopyableText text={wallet} showSolscan={true} />
                      </div>
                      <div className="shrink-0">
                        {bundle.wallet_categories?.[wallet] === "sniper" ? (
                          <div className="rounded-full bg-yellow-500/10 p-1.5 text-yellow-500">
                            <LocateFixed className="size-4" />
                          </div>
                        ) : (
                          <div className="rounded-full bg-blue-500/10 p-1.5 text-blue-500">
                            <CircleUserRound className="size-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Tokens Bought:
                        </span>
                        <span className="font-medium">
                          {info.tokens.toLocaleString()} (
                          {info.token_percentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          SOL Spent:
                        </span>
                        <span className="font-medium">
                          {info.sol.toFixed(2)} SOL (
                          {info.sol_percentage.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BundleList({ bundles }: BundleListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const bundleEntries = Object.entries(bundles || {});
  const totalPages = bundleEntries.length;
  const progress = ((currentPage + 1) / totalPages) * 100;
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else if (e.key === "ArrowRight" && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Sort bundles by total tokens
  const sortedBundleEntries = bundleEntries.sort(
    (a, b) => b[1].total_tokens - a[1].total_tokens
  );

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown} tabIndex={0}>
      {totalPages > 1 && (
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="flex items-center justify-center w-28 hover:bg-muted/50 rounded-md px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="mr-2 size-4" />
              Previous
            </button>
            <span className="flex items-center text-sm text-muted-foreground font-medium">
              {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage >= totalPages - 1}
              className="flex items-center justify-center w-28 hover:bg-muted/50 rounded-md px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="ml-2 size-4" />
            </button>
          </div>
          <div className="relative h-2 w-full rounded-full bg-muted/50">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="bundle-container">
        {sortedBundleEntries.map(([address, bundle], index) => {
          if (index !== currentPage) return null;
          return <BundleCard bundle={bundle} index={index} key={address} />;
        })}
      </div>
    </div>
  );
}
