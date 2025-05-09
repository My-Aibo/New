"use client";

import { ArrowUpRight } from "lucide-react";
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

export default function HoldingCard({
  coin1,
  coin2,
}: {
  coin1: string;
  coin2: string;
}) {
  return (
    <div className="border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {coin1.charAt(0)}
              </span>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center absolute -bottom-1 -right-1 border-2 border-gray-800">
              <span className="text-white font-bold text-xs">
                {coin2.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="text-xs text-gray-400">Locked As Staking</div>
            <div className="font-medium">
              {coin1} - {coin2}
            </div>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-gray-500" />
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-400">Reward Rate</div>
        <div className="text-2xl font-bold mt-1">5.01%</div>
        <div className="flex items-center mt-1 text-emerald-400">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span>66.67%</span>
        </div>
      </div>

      <div className="mt-4 h-16">
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
    </div>
  );
}
