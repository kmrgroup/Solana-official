import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
  getMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { TokenMetadata } from "@/types/token";

import { BASE_FEE_SOL, FEE_RECIPIENT } from "../config";

// Fee configuration
const DEPLOYMENT_FEE = BASE_FEE_SOL * LAMPORTS_PER_SOL; // 0.5 SOL by default

/**
 * Creates a new SPL token with the specified metadata
 */
export async function createSplTokenContract(
  connection: Connection,
  wallet: any,
  metadata: TokenMetadata,
): Promise<{
  tokenAddress: string;
  txHash: string;
  mintAuthority: string;
  freezeAuthority: string | null;
  supply: string;
}> {
  try {
    if (!wallet.publicKey) throw new Error("Wallet not connected");
    if (!wallet.signTransaction)
      throw new Error("Wallet does not support transaction signing");

    console.log("Creating token with metadata:", metadata);

    // Check if wallet has enough SOL
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < DEPLOYMENT_FEE + 0.1 * LAMPORTS_PER_SOL) {
      throw new Error(
        `Insufficient balance. You need at least ${(DEPLOYMENT_FEE + 0.1 * LAMPORTS_PER_SOL) / LAMPORTS_PER_SOL} SOL`,
      );
    }

    // Create transaction to transfer fee
    const feeTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: FEE_RECIPIENT,
        lamports: DEPLOYMENT_FEE,
      }),
    );

    // Sign and send fee transaction
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("finalized");
    feeTransaction.recentBlockhash = blockhash;
    feeTransaction.feePayer = wallet.publicKey;

    console.log("Fee transaction prepared with blockhash:", blockhash);

    console.log("Signing fee transaction...");
    try {
      const signedFeeTx = await wallet.signTransaction(feeTransaction);
      console.log("Fee transaction signed successfully");

      console.log("Sending fee transaction to network...");
      const feeTxId = await connection.sendRawTransaction(
        signedFeeTx.serialize(),
      );
      console.log("Fee transaction sent, ID:", feeTxId);

      console.log("Confirming fee transaction...");
      const confirmation = await connection.confirmTransaction(
        {
          blockhash,
          lastValidBlockHeight,
          signature: feeTxId,
        },
        "confirmed",
      );
      console.log("Fee transaction confirmed:", confirmation);
    } catch (error) {
      console.error("Error in fee transaction:", error);
      throw new Error(`Fee transaction failed: ${error.message || error}`);
    }

    console.log("Fee payment successful");

    // Create the token
    const decimals = 9; // Standard for most tokens

    // Create mint account
    const mintKeypair = Keypair.generate();
    console.log("Generated mint keypair:", mintKeypair.publicKey.toString());

    // Get minimum lamports required for mint account
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    // Create account instruction
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    });

    // Initialize mint instruction
    const initializeMintInstruction = createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      wallet.publicKey,
      metadata.freezeAuthority ? wallet.publicKey : null,
      TOKEN_PROGRAM_ID,
    );

    // Create associated token account for the wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey,
    );

    const createAssociatedTokenAccountIx =
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAddress,
        wallet.publicKey,
        mintKeypair.publicKey,
      );

    // Convert supply to proper format with decimals
    const supplyNumber = parseFloat(metadata.supply);
    const supplyBigInt = BigInt(Math.floor(supplyNumber * 10 ** decimals));

    // Mint tokens to the associated token account
    const mintToInstruction = createMintToInstruction(
      mintKeypair.publicKey,
      associatedTokenAddress,
      wallet.publicKey,
      supplyBigInt,
      [],
      TOKEN_PROGRAM_ID,
    );

    // Create transaction
    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeMintInstruction,
      createAssociatedTokenAccountIx,
      mintToInstruction,
    );

    // Set recent blockhash and fee payer
    const {
      blockhash: txBlockhash,
      lastValidBlockHeight: txLastValidBlockHeight,
    } = await connection.getLatestBlockhash("finalized");

    console.log(
      "Token creation transaction prepared with blockhash:",
      txBlockhash,
    );
    transaction.recentBlockhash = txBlockhash;
    transaction.feePayer = wallet.publicKey;

    console.log("Signing token creation transaction...");
    try {
      // Sign transaction with both wallet and mint keypair
      transaction.partialSign(mintKeypair);
      const signedTransaction = await wallet.signTransaction(transaction);
      console.log("Token creation transaction signed successfully");

      // Send and confirm transaction
      console.log("Sending token creation transaction to network...");
      const txHash = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );
      console.log("Token creation transaction sent, ID:", txHash);

      console.log("Confirming token creation transaction...");
      const confirmation = await connection.confirmTransaction(
        {
          blockhash: txBlockhash,
          lastValidBlockHeight: txLastValidBlockHeight,
          signature: txHash,
        },
        "confirmed",
      );
      console.log("Token creation transaction confirmed:", confirmation);
    } catch (error) {
      console.error("Error in token creation transaction:", error);
      throw new Error(`Token creation failed: ${error.message || error}`);
    }

    console.log(
      "Token created successfully:",
      mintKeypair.publicKey.toString(),
    );

    return {
      tokenAddress: mintKeypair.publicKey.toString(),
      txHash,
      mintAuthority: wallet.publicKey.toString(),
      freezeAuthority: metadata.freezeAuthority
        ? wallet.publicKey.toString()
        : null,
      supply: metadata.supply,
    };
  } catch (error) {
    console.error("Error creating token contract:", error);
    throw error;
  }
}

/**
 * Validates token metadata before creation
 */
export function validateTokenMetadata(metadata: TokenMetadata): string | null {
  if (!metadata.name || metadata.name.trim() === "") {
    return "Token name is required";
  }

  if (!metadata.symbol || metadata.symbol.trim() === "") {
    return "Token symbol is required";
  }

  if (metadata.symbol.length > 10) {
    return "Token symbol must be 10 characters or less";
  }

  if (
    !metadata.supply ||
    isNaN(parseFloat(metadata.supply)) ||
    parseFloat(metadata.supply) <= 0
  ) {
    return "Token supply must be a positive number";
  }

  return null;
}
