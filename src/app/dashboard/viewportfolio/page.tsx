"use client";

import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import BalanceCard from "./partials/BalanceCard";
import PortfolioEvaluationCard from "./partials/PortfolioEvaluationCard";
import TotalPnlCard from "./partials/TotalPnlCard";
import NextWeekForecast from "./partials/NextWeekForecast";
import TopPerformer from "./partials/TopPerformer";
import Risk from "./partials/Risk";
import HoldingCard from "./partials/HoldingCard";

const miniChartData = [
  { value: 10 },
  { value: 15 },
  { value: 12 },
  { value: 18 },
  { value: 16 },
  { value: 20 },
  { value: 18 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen border border-white/10 rounded-xl p-4 md:p-8 text-white">
      <div className="flex gap-4">
        <div className="w-full space-y-6">
          {/* Portfolio Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BalanceCard />
            <PortfolioEvaluationCard />
          </div>
          <HoldingCard coin1="Bitcoin" coin2="Ethereum" />
        </div>
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <TotalPnlCard />
          <NextWeekForecast />
          <TopPerformer />
          <div className="backdrop-blur-xl rounded-xl p-6 border border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <div className="text-sm font-medium">AI Insights</div>
              </div>
              <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                New
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400 mt-2"></div>
                <p className="text-xs text-gray-300">
                  ETH likely to rise 5-7% in next 48 hours based on market
                  patterns
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400 mt-2"></div>
                <p className="text-xs text-gray-300">
                  Consider rebalancing portfolio to increase BTC allocation
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400 mt-2"></div>
                <p className="text-xs text-gray-300">
                  Market volatility expected to decrease in coming week
                </p>
              </div>
            </div>
            <button className="w-full mt-4 text-xs text-center py-2 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-colors">
              View detailed analysis
            </button>
          </div>
          <Risk />
        </div>
      </div>
      {/* Cryptocurrency Prices Section */}
      <div className="rounded-xl p-6 border border-white/10 mt-5">
        <h2 className="text-xl font-semibold mb-5">Recent transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-gray-400 text-sm">
                <th className="pb-4 font-medium">
                  Name <ChevronDown className="inline h-4 w-4" />
                </th>
                <th className="pb-4 font-medium">
                  Price <ChevronDown className="inline h-4 w-4" />
                </th>
                <th className="pb-4 font-medium">
                  Change <ChevronDown className="inline h-4 w-4" />
                </th>
                <th className="pb-4 font-medium">
                  Volume (24) <ChevronDown className="inline h-4 w-4" />
                </th>
                <th className="pb-4 font-medium">
                  Market Cap <ChevronDown className="inline h-4 w-4" />
                </th>
                <th className="pb-4 font-medium">Weekly Chart</th>
              </tr>
            </thead>
            <tbody>
              {["Bitcoin", "Ethereum"].map((name, idx) => (
                <tr key={idx} className="border-b border-gray-800">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">
                          {name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-gray-500 text-sm">
                          {name.slice(0, 3).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-medium">$63,464.76</td>
                  <td className="py-4">
                    <div className="flex items-center text-emerald-400">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>9.50%</span>
                    </div>
                  </td>
                  <td className="py-4">$36,315,528,075</td>
                  <td className="py-4 text-emerald-400">$1,253,941,513,262</td>
                  <td className="py-4">
                    <div className="h-10 w-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={miniChartData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="rgb(16, 185, 129)"
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
