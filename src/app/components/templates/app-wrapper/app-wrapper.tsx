"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { ToastProvider } from "../../atoms/toast/toast-provider";

// Configure Solana wallet connectors
const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId="cm7dkvuaw0160seimquuwcraw"
      config={{
        appearance: {
          accentColor: "#38CCCD",
          theme: "#222224",
          showWalletLoginFirst: true,
          logo: "https://i.postimg.cc/mDKSgbs5/1-Logo-400-square.png",
          walletChainType: "solana-only",
          walletList: ["phantom"],
        },
        loginMethods: ["email", "google", "twitter", "wallet"],
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
          ethereum: {
            createOnLogin: "off",
          },
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </PrivyProvider>
  );
}
