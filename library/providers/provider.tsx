"use client";
import React from "react";
import WagmiProvider from "./wagmi";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <WagmiProvider>{children}</WagmiProvider>
    </div>
  );
};

export default RootProvider;
