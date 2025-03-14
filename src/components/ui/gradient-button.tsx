import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:from-blue-600 hover:to-purple-700",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm hover:from-red-600 hover:to-pink-700",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-sm hover:from-gray-800 hover:to-gray-950",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:from-green-600 hover:to-emerald-700",
        warning:
          "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow hover:from-yellow-600 hover:to-amber-700",
        solana:
          "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow hover:from-purple-600 hover:to-fuchsia-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
