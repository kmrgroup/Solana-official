import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

const WalletConnectionDebug: React.FC = () => {
  const {
    publicKey,
    connected,
    connecting,
    wallet,
    select,
    wallets,
    disconnect,
  } = useWallet();
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for available wallets
    const walletNames = wallets.map((w) => w.adapter.name);
    setAvailableWallets(walletNames);

    // Check for detected wallets in window
    const detected = [];
    if (window.solana) detected.push("Solana (window.solana)");
    if (window.phantom) detected.push("Phantom (window.phantom)");
    if (window.solflare) detected.push("Solflare (window.solflare)");
    setDetectedWallets(detected);
  }, [wallets]);

  const forceConnect = (walletName: string) => {
    try {
      setError(null);
      const walletToUse = wallets.find((w) => w.adapter.name === walletName);
      if (walletToUse) {
        select(walletToUse.adapter.name);

        // Force wallet connection after a short delay
        setTimeout(() => {
          if (walletToUse.adapter.connect) {
            walletToUse.adapter.connect().catch((err) => {
              console.error(`Error connecting to ${walletName}:`, err);
              setError(
                `Failed to connect to ${walletName}: ${err.message || "Unknown error"}`,
              );
            });
          }
        }, 500);
      } else {
        setError(`Wallet ${walletName} not found`);
      }
    } catch (err) {
      console.error("Force connect error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const resetConnection = () => {
    try {
      setError(null);
      disconnect();
      // Clear any cached connection data
      localStorage.removeItem("walletName");

      // Force page reload to clear any wallet state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Reset connection error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <GlassCard className="w-full p-6">
      <h2 className="text-xl font-bold mb-4 text-white">
        Wallet Connection Debugger
      </h2>

      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-black/30 p-4 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">
            Connection Status
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-400">Connected:</span>{" "}
              {connected ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Yes
                </span>
              ) : (
                <span className="text-red-400">No</span>
              )}
            </p>
            <p>
              <span className="text-gray-400">Connecting:</span>{" "}
              {connecting ? (
                <span className="text-yellow-400">Yes (in progress)</span>
              ) : (
                <span>No</span>
              )}
            </p>
            {wallet && (
              <p>
                <span className="text-gray-400">Active Wallet:</span>{" "}
                {wallet.adapter.name}
              </p>
            )}
            {publicKey && (
              <p>
                <span className="text-gray-400">Public Key:</span>{" "}
                {publicKey.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">
            Available Wallets
          </h3>
          {availableWallets.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableWallets.map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => forceConnect(name)}
                  className="justify-start text-left"
                >
                  Connect {name}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-yellow-400 text-sm">No wallet adapters found</p>
          )}
        </div>

        <div className="bg-black/30 p-4 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">
            Detected Browser Wallets
          </h3>
          {detectedWallets.length > 0 ? (
            <ul className="list-disc list-inside text-sm space-y-1">
              {detectedWallets.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-400 text-sm">
              No wallet extensions detected in browser
            </p>
          )}
        </div>

        <Button
          variant="destructive"
          onClick={resetConnection}
          className="mt-4"
        >
          Reset Wallet Connection
        </Button>
      </div>
    </GlassCard>
  );
};

export default WalletConnectionDebug;
