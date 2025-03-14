import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface FeeCalculatorProps {
  baseFee?: number;
  freezeAuthority?: boolean;
  mintAuthority?: boolean;
  updateAuthority?: boolean;
  modifyCreator?: boolean;
  freezeFee?: number;
  mintFee?: number;
  updateFee?: number;
  creatorFee?: number;
}

const FeeCalculator = ({
  baseFee = 0.1,
  freezeAuthority = false,
  mintAuthority = false,
  updateAuthority = false,
  modifyCreator = false,
  freezeFee = 0.1,
  mintFee = 0.1,
  updateFee = 0.1,
  creatorFee = 0.1,
}: FeeCalculatorProps) => {
  // Calculate total fee based on selected authorities
  const calculateTotalFee = () => {
    let total = baseFee;
    if (freezeAuthority) total += freezeFee;
    if (mintAuthority) total += mintFee;
    if (updateAuthority) total += updateFee;
    if (modifyCreator) total += creatorFee;
    return Math.min(total, 0.5); // Cap at 0.5 SOL
  };

  const totalFee = calculateTotalFee();

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">
          Fee Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Base Fee</span>
            <span className="font-medium">{baseFee} SOL</span>
          </div>

          {freezeAuthority && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Freeze Authority</span>
              <span className="font-medium">+{freezeFee} SOL</span>
            </div>
          )}

          {mintAuthority && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mint Authority</span>
              <span className="font-medium">+{mintFee} SOL</span>
            </div>
          )}

          {updateAuthority && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Update Authority</span>
              <span className="font-medium">+{updateFee} SOL</span>
            </div>
          )}

          {modifyCreator && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Modify Creator</span>
              <span className="font-medium">+{creatorFee} SOL</span>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total Fee</span>
          <span className="font-bold text-lg text-primary">{totalFee} SOL</span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Fees are paid in SOL and are required to cover network transaction
          costs and service fees. Additional authorities may increase security
          and flexibility but come with extra costs.
        </p>
      </CardContent>
    </Card>
  );
};

export default FeeCalculator;
