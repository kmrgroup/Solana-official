import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";

interface WalletConnectionModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConnect?: (walletType: string) => void;
  connectionStatus?: "idle" | "connecting" | "success" | "error";
  errorMessage?: string;
}

const WalletConnectionModal = ({
  isOpen = true,
  onOpenChange = () => {},
  onConnect = () => {},
  connectionStatus = "idle",
  errorMessage = "Failed to connect to wallet. Please try again.",
}: WalletConnectionModalProps) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const wallets = [
    {
      id: "phantom",
      name: "Phantom",
      icon: <Wallet className="h-6 w-6 text-purple-500" />,
      description: "Connect to your Phantom wallet",
    },
    {
      id: "solflare",
      name: "Solflare",
      icon: <Wallet className="h-6 w-6 text-orange-500" />,
      description: "Connect to your Solflare wallet",
    },
  ];

  const handleConnect = (walletId: string) => {
    setSelectedWallet(walletId);
    onConnect(walletId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-center">
            Connect your Solana wallet to create your meme coin
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedWallet === wallet.id && connectionStatus === "connecting" ? "bg-gray-100 border-blue-500" : "hover:bg-gray-50"}`}
              onClick={() => handleConnect(wallet.id)}
            >
              <div className="mr-3">{wallet.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium">{wallet.name}</h3>
                <p className="text-sm text-gray-500">{wallet.description}</p>
              </div>
              {selectedWallet === wallet.id &&
                connectionStatus === "connecting" && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              {selectedWallet === wallet.id &&
                connectionStatus === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
            </div>
          ))}
        </div>

        {connectionStatus === "error" && (
          <div className="bg-red-50 p-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedWallet || connectionStatus === "connecting"}
            onClick={() => selectedWallet && handleConnect(selectedWallet)}
          >
            {connectionStatus === "connecting" ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectionModal;
