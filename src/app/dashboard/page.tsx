"use client";

import ChatBot from "../components/organisms/chat-bot/ChatBot";

export default function Dashboard() {
  return (
    <div className=" flex flex-col items-center justify-center  px-4 text-dynamic">
      {/* Branding */}
      {/* <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-[#94EFEB] to-white bg-clip-text text-transparent">
          aibo.
        </h1>
        <h2 className="text-2xl sm:text-3xl font-medium text-dynamic/90">
          Your Solana AI Agent
        </h2>
        <p className="text-sm sm:text-base text-dynamic/60">
          Ask about your wallet, trades, tokens or trends.
        </p>
      </div> */}
      <ChatBot />
    </div>
  );
}
