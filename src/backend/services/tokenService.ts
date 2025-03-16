import { Connection } from "@solana/web3.js";
import { TokenMetadata } from "@/types/token";
import {
  createSplTokenContract,
  validateTokenMetadata,
} from "@/backend/utils/tokenCreator";

/**
 * Service for handling token creation and management
 */
export class TokenService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Creates a new token with the provided metadata
   */
  async createToken(wallet: any, metadata: TokenMetadata) {
    // Validate the token metadata
    const validationError = validateTokenMetadata(metadata);
    if (validationError) {
      throw new Error(validationError);
    }

    // Create the token
    return await createSplTokenContract(this.connection, wallet, metadata);
  }

  /**
   * Validates token metadata
   */
  validateMetadata(metadata: TokenMetadata): string | null {
    return validateTokenMetadata(metadata);
  }
}
