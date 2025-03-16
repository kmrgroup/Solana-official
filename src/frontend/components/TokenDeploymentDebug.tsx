import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "@/backend/utils/solanaConnection";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const TokenDeploymentDebug: React.FC = () => {
  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkWalletCapabilities = async () => {
    try {
      setError(null);

      if (!connected || !publicKey || !wallet) {
        setError("Wallet not connected properly");
        return;
      }

      // Check wallet balance
      const balance = await connection.getBalance(publicKey);

      // Check wallet adapter capabilities
      const walletCapabilities = {
        publicKey: publicKey.toString(),
        balance: `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`,
        hasSignTransaction: !!wallet.adapter?.signTransaction,
        hasSignAllTransactions: !!wallet.adapter?.signAllTransactions,
        connected: connected,
        walletName: wallet.adapter?.name || "Unknown",
      };

      // Check connection status
      const connectionStatus = {
        endpoint: connection.rpcEndpoint,
        commitment: connection.commitment,
        rpcVersion: await connection.getVersion(),
      };

      setWalletInfo(walletCapabilities);
      setConnectionInfo(connectionStatus);
    } catch (err) {
      console.error("Error checking wallet:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <GlassCard className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Token Deployment Debug
      </h2>

      <div className="mb-4">
        <GradientButton
          variant="solana"
          onClick={checkWalletCapabilities}
          disabled={!connected}
        >
          Check Wallet & Connection
        </GradientButton>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-500/20 border border-red-500 rounded-md text-red-200">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {walletInfo && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Wallet Information
          </h3>
          <div className="bg-black/30 p-4 rounded-md">
            <pre className="text-sm text-gray-300 overflow-auto">
              {JSON.stringify(walletInfo, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {connectionInfo && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            Connection Information
          </h3>
          <div className="bg-black/30 p-4 rounded-md">
            <pre className="text-sm text-gray-300 overflow-auto">
              {JSON.stringify(connectionInfo, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default TokenDeploymentDebug;
