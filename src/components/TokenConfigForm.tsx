import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Upload, Info, Sparkles, Zap } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TokenMetadata } from "@/types/token";
import { GradientButton } from "./ui/gradient-button";

interface TokenConfigFormProps {
  onConfigChange?: (config: TokenMetadata) => void;
}

const TokenConfigForm: React.FC<TokenConfigFormProps> = ({
  onConfigChange = () => {},
}) => {
  const [config, setConfig] = useState<TokenMetadata>({
    name: "My Meme Coin",
    symbol: "MEME",
    supply: "1000000000",
    description: "A fun meme coin on Solana blockchain",
    image: null,
    freezeAuthority: false,
    mintAuthority: false,
    updateAuthority: false,
    modifyCreator: false,
    creatorName: "CoinFast",
    creatorWebsite: "https://coinfast.fun",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const updatedConfig = { ...config, [name]: value };
    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const handleSwitchChange = (
    name: keyof Pick<
      TokenMetadata,
      "freezeAuthority" | "mintAuthority" | "updateAuthority" | "modifyCreator"
    >,
  ) => {
    const updatedConfig = { ...config, [name]: !config[name] };
    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setConfig({ ...config, image: file });
      setImagePreview(URL.createObjectURL(file));
      onConfigChange({ ...config, image: file });
    }
  };

  // Generate random meme coin name and symbol
  const generateRandomToken = () => {
    const prefixes = [
      "Moon",
      "Doge",
      "Shib",
      "Pepe",
      "Rocket",
      "Ape",
      "Cat",
      "Frog",
      "Space",
      "Elon",
    ];
    const suffixes = [
      "Coin",
      "Token",
      "Moon",
      "Rocket",
      "Inu",
      "Floki",
      "Cash",
      "Swap",
      "Finance",
      "Meme",
    ];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${randomPrefix} ${randomSuffix}`;

    // Generate symbol from name (first letters)
    const symbol = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    // Generate random supply between 100M and 1T
    const supply =
      (Math.floor(Math.random() * 900) + 100).toString() + "000000";

    const updatedConfig = {
      ...config,
      name,
      symbol,
      supply,
      description: `${name} is the next big meme coin on Solana! To the moon! 🚀`,
    };

    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  return (
    <GlassCard className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Configure Your Token</h2>
        <GradientButton
          variant="solana"
          size="sm"
          className="flex items-center gap-1"
          onClick={generateRandomToken}
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Random</span>
        </GradientButton>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-white mb-2 block">
              Token Name
            </Label>
            <Input
              id="name"
              name="name"
              value={config.name}
              onChange={handleInputChange}
              placeholder="My Meme Coin"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="symbol" className="text-white mb-2 block">
              Token Symbol
            </Label>
            <Input
              id="symbol"
              name="symbol"
              value={config.symbol}
              onChange={handleInputChange}
              placeholder="MEME"
              className="bg-white/10 border-white/20 text-white uppercase"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="supply" className="text-white mb-2 block">
            Token Supply
          </Label>
          <Input
            id="supply"
            name="supply"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={config.supply}
            onChange={handleInputChange}
            placeholder="1000000000"
            className="bg-white/10 border-white/20 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            The total number of tokens to be created
          </p>
        </div>

        <div>
          <Label htmlFor="description" className="text-white mb-2 block">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={config.description}
            onChange={handleInputChange}
            placeholder="A brief description of your token"
            className="bg-white/10 border-white/20 text-white min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">Token Image</Label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Token preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Recommended: 512x512px PNG or JPG
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Token Authorities
          </h3>
          <p className="text-sm text-gray-300">
            Select which authorities you want to retain after token creation.
            Each option adds 0.1 SOL to the base fee.
          </p>

          <TooltipProvider>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">Freeze Authority</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Allows you to freeze token accounts, preventing
                        transfers
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  checked={config.freezeAuthority}
                  onCheckedChange={() => handleSwitchChange("freezeAuthority")}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">Mint Authority</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Allows you to mint additional tokens in the future
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  checked={config.mintAuthority}
                  onCheckedChange={() => handleSwitchChange("mintAuthority")}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white">Update Authority</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Allows you to update token metadata after creation
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  checked={config.updateAuthority}
                  onCheckedChange={() => handleSwitchChange("updateAuthority")}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              <div className="pt-6 border-t border-gray-700 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Modify Creator Information
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Change Creator Info</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Change the information of the creator in the metadata.
                          By default, it is CoinFast.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">(+0.1 SOL)</span>
                    <Switch
                      checked={config.modifyCreator}
                      onCheckedChange={() =>
                        handleSwitchChange("modifyCreator")
                      }
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </div>
                </div>

                {config.modifyCreator && (
                  <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
                    <div>
                      <Label
                        htmlFor="creatorName"
                        className="text-white mb-2 block"
                      >
                        Creator Name
                      </Label>
                      <Input
                        id="creatorName"
                        name="creatorName"
                        value={config.creatorName}
                        onChange={handleInputChange}
                        placeholder="CoinFast"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="creatorWebsite"
                        className="text-white mb-2 block"
                      >
                        Creator Website
                      </Label>
                      <Input
                        id="creatorWebsite"
                        name="creatorWebsite"
                        value={config.creatorWebsite}
                        onChange={handleInputChange}
                        placeholder="https://coinfast.fun"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </GlassCard>
  );
};

export default TokenConfigForm;
