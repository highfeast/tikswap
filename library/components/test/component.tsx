import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import React, { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

import useProofGenerator from "@/library/hooks/useProofGenerator";
import useProofVerifier from "@/library/hooks/useProofVerifier";
import { TikSwapClient } from "@/library/utils/TikSwapRPC";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const Component = () => {
  const [availableAddresses, setAvailableAddresses] = useState<`0x${string}`[]>(
    []
  );
  const { data: walletClient, status: walletConnStatus } = useWalletClient();
  const { isConnected } = useAccount();
  const {
    proof,
    loading: generatingLoading,
    nullifier,
    generateProof,
  } = useProofGenerator();
  const { loading: verifyingLoading, verifyProof, status } = useProofVerifier();

  const initAddresses = async () => {
    const addresses = await walletClient?.getAddresses();
    setAvailableAddresses(addresses || []);
  };

  useEffect(() => {
    if (isConnected) {
      initAddresses();
    }
  }, [walletConnStatus]);

  const userOpReceiptMaxDurationIntervals: { [key in number]?: number } = {
    [80001]: 60000,
  };

  // const BundleTxn = async () => {
  //     const ethereum = global?.window?.ethereum;
  //     if (!ethereum || !ethereum.isMetaMask) return;
  //     const provider = new BrowserProvider(ethereum)

  //     // Create Biconomy Smart Account instance
  //     const smartWallet = await createSmartAccountClient({
  //         chainId: 88882,
  //         signer: await provider.getSigner(),
  //         bundlerUrl: "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"
  //     });

  //     const saAddress = await smartWallet.getAccountAddress();
  //     console.log("SA Address", saAddress);
  // }

  async function testTikSwapClient() {
    // Instantiate the TikSwapClient
    const tikSwapClient = new TikSwapClient();

    // Call the methods of the TikSwapClient
    await tikSwapClient.addEvent("Test Event", "2024-02-18", 1, 0);
    // await tikSwapClient.purchaseTicket(1, '0x48656c6c6f20576f726c6421');
    // await tikSwapClient.submitIntent(1, 'intentNullifier');
    // await tikSwapClient.offerTicket(1, 'sellersNullifier');
  }

  //   const toAddress = "0xaddress";
  // const transactionData = "0x123";
  // const tx = {
  //     to: toAddress,
  //     data: transactionData,
  // };
  // const txs = [tx, tx];
  // const userOpResponse = await smartWallet.sendTransaction(txs);
  // const { transactionHash } = await userOpResponse.waitForTxHash();
  // console.log("Transaction Hash", transactionHash);
  // const userOpReceipt = await userOpResponse.wait();
  // if (userOpReceipt.success == 'true') {
  //     console.log("UserOp receipt", userOpReceipt)
  //     console.log("Transaction receipt", userOpReceipt.receipt)
  // }

  return (
    <VStack alignItems="center" justifyContent="center" bg="white" minH="70vh">
      <Heading>TikSwap</Heading>

      {availableAddresses.map((acc) => (
        <React.Fragment key={acc}>
          {/* we can pass a hash of the event to the generate proof */}
          <Button
            onClick={() => generateProof(acc)}
            isLoading={generatingLoading}
          >
            Generate Proof
          </Button>
          <br />
        </React.Fragment>
      ))}

      {proof && (
        <React.Fragment>
          <Text fontSize="sm">Proof generated</Text>
          <br />
          {status.toLocaleLowerCase() === "s" && (
            <Text fontSize="sm">Proof generated</Text>
          )}
          <br />
          <Button
            onClick={() => verifyProof(proof)}
            isLoading={verifyingLoading}
          >
            Verify Proof
          </Button>
          <br />
        </React.Fragment>
      )}

      <Button onClick={testTikSwapClient}>Create Smart Wallet</Button>
    </VStack>
  );
};

export default Component;
