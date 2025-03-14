import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  Transaction,
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

// Initialize connection to Solana network
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Create a new SPL token
export async function createSplToken(
  wallet: any,
  metadata: TokenMetadata,
): Promise<string> {
  try {
    if (!wallet.publicKey) throw new Error("Wallet not connected");

    // Request airdrop for testing on devnet
    const signature = await connection.requestAirdrop(
      wallet.publicKey,
      1000000000,
    ); // 1 SOL
    await connection.confirmTransaction(signature);

    // Create new mint
    const mint = await createMint(
      connection,
      wallet.payer, // payer
      wallet.publicKey, // mint authority
      metadata.freezeAuthority ? wallet.publicKey : null, // freeze authority
      9, // decimals
    );

    // Get the token account of the wallet address, create if it doesn't exist
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      mint,
      wallet.publicKey,
    );

    // Mint tokens to the token account
    const supplyNumber = parseFloat(metadata.supply);
    const supplyBigInt = BigInt(supplyNumber * 10 ** 9); // Convert to smallest units with 9 decimals

    await mintTo(
      connection,
      wallet.payer,
      mint,
      tokenAccount.address,
      wallet.publicKey,
      supplyBigInt,
    );

    // Return the mint address (token address)
    return mint.toBase58();
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}

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
