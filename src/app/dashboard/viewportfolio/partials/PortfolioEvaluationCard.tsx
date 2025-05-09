"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const bigChartData = [
  { name: "JAN", value: 400 },
  { name: "FEB", value: 300 },
  { name: "MAR", value: 500 },
  { name: "APR", value: 400 },
  { name: "MAY", value: 600 },
  { name: "JUN", value: 500 },
  { name: "JUL", value: 700 },
  { name: "AUG", value: 650 },
];

export default function PortfolioEvaluationCard() {
  return (
    <div className="rounded-xl p-6 border border-white/10 col-span-2">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Evaluation</h2>
          <p className="text-sm text-gray-400">Assets in a year</p>
        </div>
        <div className="flex space-x-2">
          {["24H", "1W", "1M", "1Y", "ALL"].map((label) => (
            <button
              key={label}
              className="text-xs border-white/10 border rounded-xl px-2 py-1"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bigChartData}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="rgb(16, 185, 129)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="rgb(16, 185, 129)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="rgb(16, 185, 129)"
              fill="url(#colorGreen)"
              strokeWidth={2}
              dot={{
                r: 4,
                stroke: "white",
                strokeWidth: 2,
                fill: "rgb(16, 185, 129)",
              }}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#ccc", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                background: "transparent", // dark transparent
                backdropFilter: "blur(8px)", // blur behind
                WebkitBackdropFilter: "blur(8px)", // Safari support
                border: "1px solid rgba(255, 255, 255, 0.1)", // light border
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelStyle={{
                fontSize: "11px",
                color: "#9ca3af",
                marginBottom: "4px",
              }}
              itemStyle={{
                fontSize: "12px",
                color: "#9ca3af",
                textTransform: "uppercase",
              }}
              cursor={{
                stroke: "rgba(255,255,255,0.1)",
                strokeWidth: 1,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
