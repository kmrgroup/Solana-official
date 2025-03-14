import React from "react";

interface AnimatedGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative min-h-screen overflow-hidden ${className}`}
      style={{
        background: "#0f172a",
      }}
    >
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-fuchsia-600/20 blur-[100px] animate-blob"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedGradientBackground;
