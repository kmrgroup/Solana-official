/**
 * Configuration for the Solana token creator
 */
import { PublicKey } from "@solana/web3.js";

// Network configuration
export const NETWORK_CONFIG = {
  // Default to devnet for testing
  NETWORK: process.env.SOLANA_NETWORK || "devnet",

  // Custom RPC endpoint (if provided)
  CUSTOM_RPC_URL: process.env.CUSTOM_RPC_URL || "",

  // Transaction confirmation levels
  CONFIRMATION_COMMITMENT: "confirmed" as const,

  // Transaction timeout (in milliseconds)
  TRANSACTION_TIMEOUT: 60000, // 60 seconds
};

// Fee configuration
export const FEE_CONFIG = {
  // Base fee for token creation (in SOL)
  BASE_FEE: 0.5,

  // Fee recipient wallet address
  FEE_RECIPIENT:
    process.env.FEE_RECIPIENT || "9ktvrbraBWAaNtGZYx5CGuo1XqgUHQByC3X3r4DSkqua",

  // Whether to enforce fee payment
  ENFORCE_FEES: true,
};

// Token configuration
export const TOKEN_CONFIG = {
  // Default decimals for new tokens
  DEFAULT_DECIMALS: 9,

  // Maximum symbol length
  MAX_SYMBOL_LENGTH: 10,

  // Maximum name length
  MAX_NAME_LENGTH: 32,

  // Maximum supply (BigInt representation)
  MAX_SUPPLY: BigInt("18446744073709551615"), // u64 max
};

// Base fee in SOL
export const BASE_FEE_SOL = 0.5;

// Fee recipient address
export const FEE_RECIPIENT = new PublicKey(
  "9ktvrbraBWAaNtGZYx5CGuo1XqgUHQByC3X3r4DSkqua",
);
