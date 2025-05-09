import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

const shortenAddress = (walletAddress: string) => {
  if (!walletAddress) return "";
  return walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
};

export { shortenAddress };
