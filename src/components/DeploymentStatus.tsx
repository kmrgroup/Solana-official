import React, { useState } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export interface DeploymentStatusProps {
  status?: "idle" | "deploying" | "success" | "error";
  progress?: number;
  tokenName?: string;
  tokenSymbol?: string;
  tokenAddress?: string;
  txHash?: string;
  mintAuthority?: string;
  freezeAuthority?: string | null;
  errorMessage?: string;
  onRetry?: () => void;
  onCreateAnother?: () => void;
}

const DeploymentStatus = ({
  status = "idle",
  progress = 0,
  tokenName = "Sample Token",
  tokenSymbol = "SMPL",
  tokenAddress = "7nVTXkqKPHGW7gxP8mGKA5BNYFzMvxqR9QXbfsYrJcH1",
  txHash = "5UfDuX1gZWDDhKHpgBvd8kMWXmJxWLBdDTYSfxBiWFGEZe1XGbCVGVDUHKyKpQSVtKz2hU9F6zTBjNKUEMqnUJAP",
  mintAuthority = "7nVTXkqKPHGW7gxP8mGKA5BNYFzMvxqR9QXbfsYrJcH1",
  freezeAuthority = null,
  errorMessage = "Transaction failed. Please check your wallet and try again.",
  onRetry = () => {},
  onCreateAnother = () => {},
}: DeploymentStatusProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (status) {
      case "deploying":
        return (
          <div className="space-y-4 p-6 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <h3 className="text-lg font-medium">Deploying your token</h3>
            </div>
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-sm text-muted-foreground">
              Please wait while we deploy your {tokenName} ({tokenSymbol}) token
              to the Solana blockchain. This may take a few moments.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="space-y-4 p-6 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium">Deployment successful!</h3>
            </div>
            <Alert>
              <AlertTitle>Token Details</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {tokenName}
                  </div>
                  <div>
                    <span className="font-medium">Symbol:</span> {tokenSymbol}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Address:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {tokenAddress}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="h-7 px-2"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div>
                    <span className="font-medium">Mint Authority:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs ml-2">
                      {mintAuthority}
                    </code>
                  </div>
                  {freezeAuthority && (
                    <div>
                      <span className="font-medium">Freeze Authority:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs ml-2">
                        {freezeAuthority}
                      </code>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Transaction Hash:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs block mt-1 overflow-x-auto">
                      {txHash}
                    </code>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            <div className="flex items-center space-x-2 pt-2">
              <Button variant="default" onClick={onCreateAnother}>
                Create Another Token
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://explorer.solana.com/address/${tokenAddress}`,
                    "_blank",
                  )
                }
              >
                View on Explorer
              </Button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="space-y-4 p-6 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-medium">Deployment failed</h3>
            </div>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button variant="default" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        );

      default: // idle
        return (
          <div className="space-y-4 p-6 bg-background rounded-lg border border-border">
            <h3 className="text-lg font-medium">Ready to Deploy</h3>
            <p className="text-sm text-muted-foreground">
              Review your token configuration and click "Deploy Token" to create
              your meme coin on the Solana blockchain.
            </p>
          </div>
        );
    }
  };

  return <div className="w-full bg-card">{renderContent()}</div>;
};

export default DeploymentStatus;
