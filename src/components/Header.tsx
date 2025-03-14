import React from "react";
import { GradientButton } from "./ui/gradient-button";
import { cn } from "@/lib/utils";
import { Wallet, Coins, Menu, X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { connection } from "@/lib/solana";

const Header = () => {
  const { publicKey } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [solBalance, setSolBalance] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / 1000000000); // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      } else {
        setSolBalance(null);
      }
    };

    fetchBalance();
    // Set up an interval to refresh the balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000);

    return () => clearInterval(intervalId);
  }, [publicKey]);

  return (
    <header className="w-full h-20 bg-background/80 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-glow">
          <img
            src="/vite.svg"
            alt="Solana Meme Coin Creator Logo"
            className="w-7 h-7 animate-pulse"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-solana-gradient">
            Solana Meme Coin Creator
          </h1>
          <p className="text-xs text-muted-foreground hidden md:block">
            Launch your token in minutes
          </p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {publicKey && solBalance !== null && (
            <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {solBalance.toFixed(2)} SOL
              </span>
            </div>
          )}

          <div className="wallet-adapter-dropdown">
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-fuchsia-500 !rounded-full !py-2 !px-4 !text-white !font-medium !transition-all !shadow-md hover:!shadow-lg" />
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-secondary/20"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/40 p-4 z-50 shadow-md">
          <nav className="mb-4">
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#features"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            {publicKey && solBalance !== null && (
              <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full w-fit">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {solBalance.toFixed(2)} SOL
                </span>
              </div>
            )}

            <div className="wallet-adapter-dropdown">
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-fuchsia-500 !rounded-full !py-2 !px-4 !text-white !font-medium !transition-all !shadow-md hover:!shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
