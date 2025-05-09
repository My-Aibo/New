"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function TotalPnlCard() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const [currentBalance, setCurrentBalance] = useState<number>(0); // in SOL
  const [weekAgoBalance, setWeekAgoBalance] = useState<number>(0); // in SOL
  const [solPrice, setSolPrice] = useState<number>(0); // SOL price in USD
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (walletAddress) {
      fetchData();
    }
  }, [walletAddress]);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch SOL price
      const priceRes = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`
      );
      const priceData = await priceRes.json();
      const solPriceUSD = priceData?.solana?.usd ?? 0;
      setSolPrice(solPriceUSD);

      // Fetch wallet current SOL balance

      // FOR TESTING (STATIC VALUES, like you want)
      setCurrentBalance(0.5); // 0.5 SOL
      setWeekAgoBalance(0.45); // 0.45 SOL

      // In real after test:
      // setCurrentBalance(solBalance);
      // fetch transaction history and calculate weekAgoBalance
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const pnlSol = currentBalance - weekAgoBalance; // PNL in SOL
  const pnlUsd = pnlSol * solPrice; // PNL in USD
  const pnlPercentage =
    weekAgoBalance === 0 ? 0 : (pnlSol / Math.abs(weekAgoBalance)) * 100;
  const isPositive = pnlSol >= 0;

  function formatUSD(amount: number) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }

  function formatSOL(amount: number) {
    return `${amount.toFixed(4)} SOL`;
  }

  return (
    <div className="rounded-xl p-6 border border-white/10 backdrop-blur-md">
      <div className="text-sm text-gray-400">Total PNL (This Week)</div>

      {loading ? (
        <div className="mt-2 text-3xl font-bold text-gray-400 animate-pulse">
          Loading...
        </div>
      ) : (
        <>
          {/* USD + SOL together */}
          <div
            className={`mt-2 text-2xl font-bold ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatUSD(Math.abs(pnlUsd))} / {formatSOL(Math.abs(pnlSol))}
          </div>

          {/* PNL Percentage */}
          <div
            className={`text-xs mt-1 ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : "-"}
            {Math.abs(pnlPercentage).toFixed(2)}% compared to last week
          </div>
        </>
      )}
    </div>
  );
}
