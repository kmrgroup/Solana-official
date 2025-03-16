import React from "react";
import Header from "../components/Header";
import TokenCreator from "../components/TokenCreator";
import { GradientButton } from "@/components/ui/gradient-button";
import { useWallet } from "@solana/wallet-adapter-react";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Zap,
  Shield,
  Settings,
  ArrowRight,
  Coins,
  Clock,
  CheckCircle,
} from "lucide-react";

const Home: React.FC = () => {
  const { publicKey } = useWallet();
  const isWalletConnected = !!publicKey;

  return (
    <AnimatedGradientBackground>
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center">
          {!isWalletConnected ? (
            <div className="text-center max-w-3xl mx-auto mb-16 mt-12">
              <div className="inline-block px-4 py-1 bg-purple-500/10 rounded-full mb-4 backdrop-blur-sm border border-purple-500/20">
                <span className="text-sm font-medium text-purple-300">
                  Powered by Solana
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-blue-500">
                Create Your Own Solana Meme Coin
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Launch your custom meme coin on Solana blockchain with just a
                few clicks. No coding required! Fast, secure, and fully
                customizable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton
                  variant="solana"
                  size="xl"
                  className="group relative overflow-hidden"
                  onClick={() => {
                    console.log("Connect wallet button clicked");
                    const walletButton = document.querySelector(
                      ".wallet-adapter-button",
                    );
                    console.log("Found wallet button:", !!walletButton);
                    walletButton?.click();
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Connect Wallet to Start
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </GradientButton>
                <GradientButton
                  variant="outline"
                  size="xl"
                  className="border-purple-500/50 hover:bg-purple-500/10 text-purple-300"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </GradientButton>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>100% On-Chain</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>SPL Token Standard</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Low Gas Fees</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant Deployment</span>
                </div>
              </div>
            </div>
          ) : (
            <TokenCreator />
          )}

          <div id="features" className="mt-24 w-full max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
                Features
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to create and launch your meme coin on
                Solana
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="transform transition-all hover:scale-105 hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Fast & Easy
                </h3>
                <p className="text-gray-300">
                  Create and launch your meme coin in minutes with our intuitive
                  interface. No coding or technical knowledge required.
                </p>
              </GlassCard>

              <GlassCard className="transform transition-all hover:scale-105 hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Secure & Reliable
                </h3>
                <p className="text-gray-300">
                  Built on Solana for high security, low fees, and
                  lightning-fast transactions. Your tokens are safe and
                  compliant.
                </p>
              </GlassCard>

              <GlassCard className="transform transition-all hover:scale-105 hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <Settings className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Fully Customizable
                </h3>
                <p className="text-gray-300">
                  Complete control over token name, symbol, supply, and
                  authority settings. Create the perfect token for your needs.
                </p>
              </GlassCard>
            </div>
          </div>

          <div id="pricing" className="mt-24 w-full max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Transparent fees with no hidden costs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <GlassCard className="border border-purple-500/30 transform transition-all hover:scale-105 hover:shadow-purple-500/20">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Basic Token
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    0.5
                  </span>
                  <span className="text-xl text-purple-300 mb-1">SOL</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Standard SPL Token</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Custom Name & Symbol</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Custom Supply</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Token Image</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 opacity-50">
                    <CheckCircle className="h-5 w-5" />
                    <span>Freeze Authority</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 opacity-50">
                    <CheckCircle className="h-5 w-5" />
                    <span>Mint Authority</span>
                  </li>
                </ul>
                <GradientButton
                  variant="solana"
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    document.querySelector(".wallet-adapter-button")?.click()
                  }
                >
                  Get Started
                </GradientButton>
              </GlassCard>

              <GlassCard className="transform transition-all hover:scale-105 hover:shadow-purple-500/20">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Premium Token
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    0.5
                  </span>
                  <span className="text-xl text-purple-300 mb-1">SOL</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Freeze Authority (+0.1 SOL)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Mint Authority (+0.1 SOL)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Update Authority (+0.1 SOL)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <GradientButton
                  variant="outline"
                  className="w-full border-purple-500/50 hover:bg-purple-500/10 text-purple-300"
                  size="lg"
                  onClick={() =>
                    document.querySelector(".wallet-adapter-button")?.click()
                  }
                >
                  Get Started
                </GradientButton>
              </GlassCard>
            </div>

            <div className="text-center mt-8 text-sm text-gray-400">
              <p>
                All fees are paid in SOL and include network transaction costs.
              </p>
            </div>
          </div>

          <div id="faq" className="mt-24 w-full max-w-4xl mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to know about creating your meme coin
              </p>
            </div>

            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-xl font-bold mb-2 text-white">
                  What is a Solana meme coin?
                </h3>
                <p className="text-gray-300">
                  A Solana meme coin is a cryptocurrency token created on the
                  Solana blockchain, typically with a humorous or pop culture
                  theme. These tokens use the SPL (Solana Program Library) token
                  standard and benefit from Solana's fast transaction speeds and
                  low fees.
                </p>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold mb-2 text-white">
                  How do I create my own meme coin?
                </h3>
                <p className="text-gray-300">
                  Simply connect your Solana wallet, configure your token
                  details (name, symbol, supply, etc.), select any additional
                  authorities you want to retain, and click "Deploy Token". The
                  process takes just a few minutes and your token will be live
                  on the Solana blockchain.
                </p>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold mb-2 text-white">
                  What are token authorities and why do they matter?
                </h3>
                <p className="text-gray-300">
                  Token authorities give you control over certain aspects of
                  your token after deployment. Freeze Authority allows you to
                  freeze token accounts, Mint Authority lets you create more
                  tokens in the future, and Update Authority enables you to
                  update token metadata. These provide flexibility but come with
                  additional costs.
                </p>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold mb-2 text-white">
                  How much SOL do I need to create a token?
                </h3>
                <p className="text-gray-300">
                  The fee is a flat 0.5 SOL for token creation, which includes
                  all optional features. You'll also need a small amount of SOL
                  for transaction fees. We recommend having at least 0.6 SOL in
                  your wallet before starting.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center">
                <img src="/vite.svg" alt="Logo" className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-300">
                Solana Meme Coin Creator
              </span>
            </div>

            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Solana Meme Coin Creator. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </AnimatedGradientBackground>
  );
};

export default Home;
