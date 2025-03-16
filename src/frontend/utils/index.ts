// Frontend utilities
import { cn } from "@/lib/utils";

export { cn };

// Add any frontend-specific utility functions here
export const formatTokenAmount = (
  amount: string | number,
  decimals: number = 9,
): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
};
