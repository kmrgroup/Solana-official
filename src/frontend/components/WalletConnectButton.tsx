import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { GradientButton } from "@/components/ui/gradient-button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface WalletConnectButtonProps {
  variant?: "solana" | "primary" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  variant = "solana",
  size = "lg",
  className = "",
  fullWidth = false,
}) => {
  const { connected, select, wallets } = useWallet();

  const handleConnectClick = () => {
    console.log("Enhanced connect wallet button clicked");

    // Direct approach - use the wallet adapter select method
    if (wallets && wallets.length > 0) {
      // Find Phantom wallet first (most common)
      const phantomWallet = wallets.find((w) => w.adapter.name === "Phantom");
      const solflareWallet = wallets.find((w) => w.adapter.name === "Solflare");
      const walletToUse = phantomWallet || solflareWallet || wallets[0];

      if (walletToUse) {
        console.log(`Directly selecting wallet: ${walletToUse.adapter.name}`);
        select(walletToUse.adapter.name);

        // Give a moment for the selection to register
        setTimeout(() => {
          try {
            // Try to connect directly
            if (walletToUse.adapter.connect) {
              walletToUse.adapter.connect().catch((err) => {
                console.error("Connection error:", err);
              });
            }
          } catch (err) {
            console.error("Error in direct connection:", err);
          }
        }, 300);
        return;
      }
    }

    // Fallback to DOM approach if direct method fails
    const walletButton = document.querySelector(
      ".wallet-adapter-button-trigger",
    );
    if (walletButton) {
      console.log("Found wallet button, clicking it");
      walletButton.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );
    } else {
      console.log("Wallet button not found, trying fallback");
      const anyWalletButton = document.querySelector(".wallet-adapter-button");
      if (anyWalletButton) {
        console.log("Found fallback wallet button, clicking it");
        anyWalletButton.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
      } else {
        console.error("No wallet button found in the DOM");
        // Don't show alert, just log the error
      }
    }
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      {/* Hidden original wallet button for functionality */}
      <div className="absolute opacity-0 pointer-events-none">
        <WalletMultiButton />
      </div>

      {/* Custom styled button */}
      <GradientButton
        variant={variant}
        size={size}
        className={className}
        onClick={handleConnectClick}
      >
        {connected ? "Wallet Connected" : "Connect Wallet"}
      </GradientButton>
    </div>
  );
};

export default WalletConnectButton;
