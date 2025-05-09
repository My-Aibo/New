"use client";

import { useState, useEffect } from "react";
import { Command } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useCommandMenuStore } from "@/lib/store/useCommandMenuStore";
import Image from "next/image";
import { useAppearanceStore } from "@/lib/store/useAppearanceStore";
import Link from "next/link";

const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`;

const Header: React.FC = () => {
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { openMenu } = useCommandMenuStore();
  const { ready, authenticated, user } = usePrivy();
  const { theme } = useAppearanceStore();

  const shortenAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  useEffect(() => {
    const fetchSolBalance = async () => {
      if (!authenticated || !user?.wallet?.address) return;

      try {
        const res = await fetch(HELIUS_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getBalance",
            params: [user.wallet.address],
          }),
        });

        const data = await res.json();
        const lamports = data.result?.value;
        if (lamports != null) {
          setSolBalance(lamports / 1e9);
        } else {
          console.error("Balance fetch failed:", data);
        }
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    };

    fetchSolBalance();
  }, [authenticated, user?.wallet?.address]);

  return (
    <header className="w-full px-6 pt-5 sticky top-0 z-50">
      <div
        className={`flex items-center justify-end gap-4 rounded-3xl p-4 bg-transparent backdrop-blur-xs border transition ${
          theme === "Dark" ? "border-white/10" : "border-black/10"
        }`}
      >
        {/* ✅ SOL Balance */}
        {solBalance !== null ? (
          <div className="flex items-center gap-1 text-dynamic font-medium">
            <Image
              src="https://cryptoicon-api.pages.dev/api/icon/sol"
              alt="SOL"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <span className="text-sm">{solBalance.toFixed(2)} SOL</span>
          </div>
        ) : (
          <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
        )}

        {/* ✅ Connection Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#94EFEB]/10 rounded-full text-[#94EFEB] text-xs font-medium">
          <span className="w-2 h-2 bg-[#94EFEB] rounded-full animate-ping-slow" />
          {ready
            ? authenticated && user?.wallet?.address
              ? "Connected"
              : "Not Connected"
            : "Loading..."}
        </div>

        {/* ✅ Wallet Address */}
        {ready ? (
          authenticated && user?.wallet?.address ? (
            <div className="text-gray-300 text-xs">
              {shortenAddress(user.wallet.address)}
            </div>
          ) : null
        ) : (
          <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
        )}

        {/* ✅ Profile Image */}
        <Link
          className="flex items-center justify-center"
          href="/dashboard/account"
        >
          <Image
            src={
              profileImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBC2UY2pAfFatruEETtg6IiIBgaLgdZuvRhX2q_jivxN7Aw-3ZqkVSYD832taq-6w8Dno&usqp=CAU"
            }
            alt="Profile Picture"
            width={35}
            height={35}
            className="rounded-full w-[35px] h-[35px] object-cover border border-[#94efeb] cursor-pointer hover:scale-105 transition-all duration-200"
          />
        </Link>

        {/* ✅ Command Menu Trigger */}
        <button
          onClick={() => openMenu()}
          title="Open Command Menu (⌘K)"
          className="hover:bg-[#94efeb]/20 text-dynamic p-2 rounded-full transition"
        >
          <Command size={18} />
        </button>
      </div>

      {/* Ping Animation */}
      <style jsx>{`
        @keyframes pingSlow {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
        .animate-ping-slow {
          animation: pingSlow 2s infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
