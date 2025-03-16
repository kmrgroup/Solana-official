import React, { useState, useEffect } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import TokenConfigForm from "@/components/TokenConfigForm";
import FeeCalculator from "@/components/FeeCalculator";
import DeploymentStatus from "@/components/DeploymentStatus";
import { GlassCard } from "@/components/ui/glass-card";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenMetadata } from "@/types/token";
import { DeploymentStatus as DeploymentStatusType } from "@/types/token";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import WalletConnectButton from "@/components/WalletConnectButton";
import WalletConnectionDebug from "@/components/WalletConnectionDebug";
import { validateTokenMetadata } from "@/backend/utils/tokenCreator";
import { createSplTokenContract } from "@/backend/utils/tokenCreator";
import { connection } from "@/backend/utils/solanaConnection";

const TokenCreator: React.FC = () => {
  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const [tokenConfig, setTokenConfig] = useState<TokenMetadata>({
    name: "My Meme Coin",
    symbol: "MEME",
    supply: "1000000000",
    description: "A fun meme coin on Solana blockchain",
    image: null,
    freezeAuthority: false,
    mintAuthority: false,
    updateAuthority: false,
    modifyCreator: false,
    creatorName: "Official Solana",
    creatorWebsite: "https://officialsolana.com",
  });

  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatusType>({
      status: "idle",
      progress: 0,
      tokenName: tokenConfig.name,
      tokenSymbol: tokenConfig.symbol,
    });

  const [activeTab, setActiveTab] = useState("configure");

  useEffect(() => {
    // When deployment is successful, switch to the deploy tab
    if (deploymentStatus.status === "success") {
      setActiveTab("deploy");
    }
  }, [deploymentStatus.status]);

  const handleConfigChange = (config: TokenMetadata) => {
    setTokenConfig(config);
    if (deploymentStatus.status === "idle") {
      setDeploymentStatus({
        ...deploymentStatus,
        tokenName: config.name,
        tokenSymbol: config.symbol,
      });
    }
  };

  const handleDeployToken = async () => {
    if (!connected || !publicKey || !wallet) {
      console.error("Wallet not connected properly");
      return;
    }

    console.log("Starting token deployment with wallet:", wallet);

    // Start deployment process
    setDeploymentStatus({
      status: "deploying",
      progress: 0,
      tokenName: tokenConfig.name,
      tokenSymbol: tokenConfig.symbol,
    });

    try {
      // Progress simulation for UX
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress <= 90) {
          setDeploymentStatus((prev) => ({
            ...prev,
            progress,
          }));
        }
      }, 300);

      // Validate token metadata
      const validationError = validateTokenMetadata(tokenConfig);
      if (validationError) {
        throw new Error(validationError);
      }

      // Actual token creation
      console.log("Attempting to create token with config:", tokenConfig);
      // Make sure we have the wallet adapter properly configured
      if (
        !wallet.adapter ||
        !wallet.adapter.publicKey ||
        !wallet.adapter.signTransaction
      ) {
        throw new Error("Wallet adapter not properly configured");
      }

      // Ensure the wallet adapter has the necessary properties for token creation
      const walletForToken = {
        publicKey: wallet.adapter.publicKey,
        payer: wallet.adapter,
        signTransaction: wallet.adapter.signTransaction.bind(wallet.adapter),
        signAllTransactions: wallet.adapter.signAllTransactions?.bind(
          wallet.adapter,
        ),
      };

      console.log("Wallet adapter capabilities:", {
        hasPublicKey: !!wallet.adapter.publicKey,
        hasSignTransaction: !!wallet.adapter.signTransaction,
        hasSignAllTransactions: !!wallet.adapter.signAllTransactions,
      });

      console.log("Using connection:", connection);
      console.log("Wallet for token:", walletForToken);

      const result = await createSplTokenContract(
        connection,
        walletForToken,
        tokenConfig,
      );
      console.log("Token created successfully:", result);

      const tokenAddress = result.tokenAddress;

      // Complete the progress and show success
      clearInterval(interval);
      setDeploymentStatus({
        status: "success",
        progress: 100,
        tokenName: tokenConfig.name,
        tokenSymbol: tokenConfig.symbol,
        tokenAddress: result.tokenAddress,
        txHash: result.txHash,
        mintAuthority: result.mintAuthority,
        freezeAuthority: result.freezeAuthority,
      });
    } catch (error) {
      console.error("Token deployment failed:", error);
      setDeploymentStatus({
        status: "error",
        tokenName: tokenConfig.name,
        tokenSymbol: tokenConfig.symbol,
        errorMessage:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleRetry = () => {
    setDeploymentStatus({
      status: "idle",
      tokenName: tokenConfig.name,
      tokenSymbol: tokenConfig.symbol,
    });
    setActiveTab("configure");
  };

  const handleCreateAnother = () => {
    // Reset form and status
    setTokenConfig({
      name: "My Meme Coin",
      symbol: "MEME",
      supply: "1000000000",
      description: "A fun meme coin on Solana blockchain",
      image: null,
      freezeAuthority: false,
      mintAuthority: false,
      updateAuthority: false,
      modifyCreator: false,
      creatorName: "OfficialSolana",
      creatorWebsite: "https://officialsolana.com",
    });
    setDeploymentStatus({
      status: "idle",
      progress: 0,
    });
    setActiveTab("configure");
  };

  if (!connected) {
    return (
      <GlassCard className="w-full max-w-3xl mx-auto p-8 text-center mt-12">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Create Your Meme Coin
        </h2>
        <p className="mb-6 text-gray-300">
          Connect your Solana wallet to start creating your custom meme coin.
        </p>
        <WalletConnectButton variant="solana" size="lg" className="w-full" />

        <div className="mt-4 text-xs text-gray-400">
          Having trouble connecting? Make sure you have a Solana wallet
          extension installed (like Phantom or Solflare).
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <WalletConnectionDebug />
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 mt-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
          Create Your Meme Coin
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Design and deploy your custom meme coin on the Solana blockchain
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/20 backdrop-blur-sm">
          <TabsTrigger
            value="configure"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
          >
            Configure Token
          </TabsTrigger>
          <TabsTrigger
            value="deploy"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
            disabled={
              deploymentStatus.status !== "success" &&
              deploymentStatus.status !== "error"
            }
          >
            Deployment Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TokenConfigForm onConfigChange={handleConfigChange} />
            </div>

            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-xl font-bold mb-4 text-white">
                  Fee Summary
                </h3>
                <FeeCalculator
                  freezeAuthority={tokenConfig.freezeAuthority}
                  mintAuthority={tokenConfig.mintAuthority}
                  updateAuthority={tokenConfig.updateAuthority}
                  modifyCreator={tokenConfig.modifyCreator}
                />
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold mb-4 text-white">
                  Ready to Launch?
                </h3>
                <p className="text-gray-300 mb-6">
                  Review your token configuration and click "Deploy Token" to
                  create your meme coin on the Solana blockchain.
                </p>
                <GradientButton
                  variant="solana"
                  size="lg"
                  className="w-full"
                  onClick={handleDeployToken}
                  disabled={
                    !tokenConfig.name ||
                    !tokenConfig.symbol ||
                    !tokenConfig.supply ||
                    deploymentStatus.status === "deploying"
                  }
                >
                  {deploymentStatus.status === "deploying"
                    ? "Deploying..."
                    : "Deploy Token"}
                </GradientButton>
              </GlassCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deploy">
          <GlassCard className="p-8">
            <DeploymentStatus
              status={deploymentStatus.status}
              progress={deploymentStatus.progress}
              tokenName={deploymentStatus.tokenName}
              tokenSymbol={deploymentStatus.tokenSymbol}
              tokenAddress={deploymentStatus.tokenAddress}
              errorMessage={deploymentStatus.errorMessage}
              onRetry={handleRetry}
              onCreateAnother={handleCreateAnother}
            />
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokenCreator;
