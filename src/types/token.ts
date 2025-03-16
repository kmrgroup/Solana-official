export interface TokenMetadata {
  name: string;
  symbol: string;
  supply: string;
  description: string;
  image: File | null;
  freezeAuthority: boolean;
  mintAuthority: boolean;
  updateAuthority: boolean;
  modifyCreator: boolean;
  creatorName: string;
  creatorWebsite: string;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  supply: string;
  decimals: number;
  image?: string;
  description?: string;
}

export interface DeploymentStatus {
  status: "idle" | "deploying" | "success" | "error";
  progress?: number;
  tokenName?: string;
  tokenSymbol?: string;
  tokenAddress?: string;
  txHash?: string;
  mintAuthority?: string;
  freezeAuthority?: string | null;
  errorMessage?: string;
}
