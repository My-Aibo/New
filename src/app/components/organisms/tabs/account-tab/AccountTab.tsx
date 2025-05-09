"use client";

import { shortenAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { Copy } from "lucide-react";
import { useState } from "react";

const AccountTab = () => {
  const { user, ready, authenticated } = usePrivy();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.wallet?.address ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedAccounts = [
    {
      name: "Email",
      isLinked: !!user?.email,
      display: user?.email?.address,
    },
    {
      name: "Google",
      isLinked: !!user?.google,
      display: user?.google?.email,
    },
    {
      name: "Twitter",
      isLinked: !!user?.twitter,
      display: user?.twitter?.username,
    },
    {
      name: "Discord",
      isLinked: !!user?.discord,
      display: user?.discord?.username,
    },
    {
      name: "GitHub",
      isLinked: !!user?.github,
      display: user?.github?.username,
    },
    {
      name: "LinkedIn",
      isLinked: !!user?.linkedin,
      display: user?.linkedin?.email,
    },
    {
      name: "Telegram",
      isLinked: !!user?.telegram,
      display: user?.telegram?.username,
    },
  ];
  if (!ready) {
    return (
      <div className="space-y-10 text-dynamic">
        {/* Wallet skeleton */}
        <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
          <div className="min-w-[300px] space-y-2">
            <div className="w-32 h-4 bg-[#2a2a2a] rounded" />
            <div className="w-48 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-60 h-6 bg-[#2a2a2a] rounded-md" />
              <div className="w-8 h-6 bg-[#2a2a2a] rounded-md" />
            </div>
          </div>
        </div>

        {/* Linked accounts skeleton */}
        <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
          <div className="min-w-[300px] space-y-2">
            <div className="w-32 h-4 bg-[#2a2a2a] rounded" />
            <div className="w-56 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="w-28 h-4 bg-[#2a2a2a] rounded" />
                <div className="w-40 h-3 bg-[#2a2a2a] rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone skeleton */}
        <div className="flex gap-10 items-start pt-2">
          <div className="min-w-[300px] space-y-2">
            <div className="w-32 h-4 bg-[#2a2a2a] rounded" />
            <div className="w-56 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="w-40 h-9 bg-[#2a2a2a] rounded" />
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="text-dynamic">
        <p>You are not logged in.</p>
        <p className="text-sm text-gray-400">
          Please connect your wallet to continue.
        </p>
      </div>
    );
  }

  const walletAddress = user.wallet?.address ?? "No wallet connected";

  return (
    <div className="space-y-10 text-dynamic">
      {/* Connected Wallet */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-dynamic font-sans text-sm">Connected Wallet</h3>
          <p className="text-gray-400 text-xs">
            This wallet is linked to your account via Privy.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <code className="bg-transparent border border-[#2a2a2a] px-3 py-1 rounded-md text-sm text-dynamic">
              {shortenAddress(walletAddress)}
            </code>
            <button
              onClick={handleCopy}
              className="text-sm text-gray-400 hover:text-dynamic"
            >
              <Copy />
            </button>
          </div>
          {copied && (
            <span className="text-xs text-green-400 font-sans">Copied!</span>
          )}
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="flex gap-10 items-start border-b border-[#2a2a2a] py-10">
        <div className="min-w-[300px]">
          <h3 className="text-dynamic font-sans text-sm">Linked Accounts</h3>
          <p className="text-gray-400 text-xs">
            Only the services you`ve connected will appear here.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xl">
          {linkedAccounts.filter((acc) => acc.isLinked).length === 0 ? (
            <p className="text-sm text-gray-400">No linked accounts.</p>
          ) : (
            linkedAccounts
              .filter((acc) => acc.isLinked)
              .map((account) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between w-full"
                >
                  <div>
                    <p className="text-sm text-dynamic">{account.name}</p>
                    <p className="text-xs text-gray-400">
                      Connected as {account.display}
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Unlink not implemented yet")}
                    className="text-sm px-3 py-1 rounded-md text-gray-300 border border-gray-600 hover:border-white hover:text-dynamic transition"
                  >
                    Disconnect
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="flex gap-10 items-start pt-2">
        <div className="min-w-[300px]">
          <h3 className="text-dynamic font-sans text-sm">Danger Zone</h3>
          <p className="text-gray-400 text-xs">This action is permanent.</p>
        </div>
        <button
          disabled
          className="text-sm cursor-not-allowed text-red-500 border border-red-500 hover:bg-red-500 hover:text-dynamic transition px-4 py-2 rounded-md"
        >
          Delete my account
        </button>
      </div>
    </div>
  );
};

export default AccountTab;
