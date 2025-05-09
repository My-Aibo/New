import React from "react";

const NextWeekForecast = () => {
  return (
    <div className="rounded-xl p-6 border border-white/10  backdrop-blur-md">
      <div className="text-sm text-gray-400">Next Week Forecast</div>
      <div className="mt-2 text-3xl font-bold text-emerald-400">+$9,100.00</div>
      <div className="text-xs text-gray-400 mt-1">
        Based on recent performance
      </div>
    </div>
  );
};

export default NextWeekForecast;
