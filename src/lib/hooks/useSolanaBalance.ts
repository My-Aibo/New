import { useState, useEffect } from 'react';

/**
 * React hook to fetch and track Solana balance for a given address
 * @param address - Solana wallet address
 * @returns Object containing balance in SOL, loading state, and any error
 */
export function useSolanaBalance(address: string | null | undefined) {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if address is empty or undefined
    if (!address) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getBalance",
              params: [address],
            }),
          }
        );

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const solBalance = data.result?.value ? data.result.value / 1e9 : 0;
        setBalance(solBalance);
      } catch (error) {
        console.error("SOL balance fetch error:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch SOL balance");
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, isLoading, error };
}
