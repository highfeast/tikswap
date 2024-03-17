"use client";

import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return <ChakraProvider>{mounted && children}</ChakraProvider>;
}
