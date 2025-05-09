// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { login, authenticated, ready, getAccessToken } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (!ready || !authenticated) return;
    (async () => {
      const token = await getAccessToken();
      if (!token) return;
      const res = await fetch("/api/set-token", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) return;
      const { onboarded } = await res.json();
      router.replace(onboarded ? "/dashboard" : "/onboarding");
    })();
  }, [authenticated, ready, getAccessToken, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <button
        onClick={() => login({ loginMethods: ["wallet", "email"] })}
        className="px-6 py-3 bg-cyan-400 text-black rounded-lg shadow-lg hover:bg-cyan-300"
      >
        Sign in with Wallet
      </button>
    </main>
  );
}
