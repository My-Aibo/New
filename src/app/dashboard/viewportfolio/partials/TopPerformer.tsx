import React from "react";

const TopPerformer = () => {
  return (
    <div className="rounded-xl p-6 border border-white/10  backdrop-blur-md">
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          Ξ
        </div>
        <span>Top Performer</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">Ethereum</div>
      <div className="text-xs text-emerald-400 mt-1">+18.2% this week</div>
    </div>
  );
};

export default TopPerformer;
