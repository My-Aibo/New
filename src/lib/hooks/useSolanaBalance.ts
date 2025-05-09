const useSolanaBalance = async (address: string) => {
  let data;
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

    data = await response.json();
    if (data.error) {
      console.error("SOL fetch error:", data.error.message);
      return 0;
    }
  } catch (error) {
    console.error("getSOLBalance fetch error:", error);
    return 0;
  }
  return {
    data,
  };
};

export { useSolanaBalance };
