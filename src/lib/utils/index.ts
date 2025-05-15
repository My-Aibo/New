import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ClassValue } from "clsx";

/**
 * Combines class names using clsx and tailwind-merge for optimized class generation
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shortens a wallet address for display purposes
 * @param walletAddress - The wallet address to shorten
 * @param startChars - Number of characters to keep from the beginning (default: 6)
 * @param endChars - Number of characters to keep from the end (default: 4)
 */
export function shortenAddress(
  walletAddress: string | null | undefined,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!walletAddress) return "";
  if (walletAddress.length <= startChars + endChars) return walletAddress;
  
  return `${walletAddress.slice(0, startChars)}...${walletAddress.slice(-endChars)}`;
}

/**
 * Format a number with thousands separators and decimal places
 * @param value - The number to format
 * @param options - Formatting options
 */
export function formatNumber(
  value: number | string | null | undefined,
  options: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    notation?: "standard" | "scientific" | "engineering" | "compact";
  } = {}
): string {
  if (value === null || value === undefined) return "—";
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return "—";
  
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    notation: options.notation,
  }).format(numValue);
}

/**
 * Format a currency value
 * @param value - The value to format
 * @param currency - Currency code (default: USD)
 * @param options - Formatting options
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = "USD",
  options: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined) return "—";
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return "—";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    ...options,
  }).format(numValue);
}

/**
 * Format a date for display
 * @param date - The date to format
 * @param options - Date format options
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  }
): string {
  if (!date) return "—";
  
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
    
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "—";
  
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}
