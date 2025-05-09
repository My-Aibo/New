import { useEffect } from "react";
import axios from "axios";

const useFetchSwapTransactions = (walletAddress: string) => {
  useEffect(() => {
    const fetchSwapTransactions = async () => {
      if (!walletAddress) return;

      const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}&type=SWAP&limit=5`;
      try {
        const response = await axios.get(url);
        const transactions = response.data;
        console.log("Fetched SWAP Transactions:", transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchSwapTransactions();
  }, [walletAddress]);
};

export default useFetchSwapTransactions;
