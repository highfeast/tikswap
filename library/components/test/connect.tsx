"use client";

import { Box, Button, VStack } from "@chakra-ui/react";
import { BaseError } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  return (
    <VStack
      px={3}
      alignItems={"flex-end"}
      justifyContent={"center"}
      py={6}
      bg="black"
    >
      <Box>
        {isConnected && (
          <Button onClick={() => disconnect()}>
            Disconnect from {connector?.name}
          </Button>
        )}

        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <Button key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && " (connecting)"}
            </Button>
          ))}
      </Box>

      {error && <div>{(error as BaseError).shortMessage}</div>}
    </VStack>
  );
}
