import { configureChains, createConfig } from "wagmi";
import { localhost, polygonMumbai, sepolia } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { chainId, verifier } from "./addresses.json";
import abi from "./verifierAbi.json";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [localhost, polygonMumbai, sepolia],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

export const contractCallConfig = {
  address: verifier as `0x${string}`,
  abi,
  chainId: chainId,
  functionName: "verify",
};
