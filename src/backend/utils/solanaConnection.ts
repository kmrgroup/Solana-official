import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getMint,
  getAccount,
} from "@solana/spl-token";
import { TokenMetadata } from "@/types/token";
import { createSplTokenContract } from "./tokenCreator";

// Initialize connection to Solana network using public RPC endpoint
export const connection = new Connection(clusterApiUrl("devnet"), {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000, // 60 seconds timeout
});

// Get token balance
export async function getTokenBalance(
  wallet: any,
  tokenAddress: string,
): Promise<number> {
  try {
    const mint = new PublicKey(tokenAddress);
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint,
      wallet.publicKey,
    );

    const accountInfo = await getAccount(connection, tokenAccount.address);
    return Number(accountInfo.amount) / 10 ** 9; // Convert from smallest units
  } catch (error) {
    console.error("Error getting token balance:", error);
    throw error;
  }
}

// Get SOL balance
export async function getSolBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 10 ** 9; // Convert from lamports to SOL
  } catch (error) {
    console.error("Error getting SOL balance:", error);
    throw error;
  }
}
