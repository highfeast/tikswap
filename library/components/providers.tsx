"use client";

import { config } from "../utils/wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import { WagmiConfig } from "wagmi";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <ChakraProvider>
      <WagmiConfig config={config}>{mounted && children}</WagmiConfig>
    </ChakraProvider>
  );
}
