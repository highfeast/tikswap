import { Barretenberg, Fr } from "@aztec/bb.js";
import { useToast } from "@chakra-ui/react";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { CompiledCircuit, ProofData } from "@noir-lang/types";
import { cpus } from "os";
import { useEffect, useState } from "react";
import { fromHex, hashMessage, recoverPublicKey } from "viem";
import { useWalletClient } from "wagmi";
import circuit from "../utils/noirstarter.json";

function useProofGenerator() {
  const [proof, setProof] = useState<ProofData>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [inputs, setInputs] = useState<any>();
  const [nullifier, setNullifier] = useState<string | null>(null);
  const toast = useToast();
  const { data: walletClient, status: walletConnStatus } = useWalletClient();
  const backend = new BarretenbergBackend(
    circuit as unknown as CompiledCircuit,
    { threads: navigator.hardwareConcurrency }
  );
  const noir = new Noir(circuit as unknown as CompiledCircuit, backend);

  useEffect(() => {
    if (loading) {
      toast({
        title:
          status === "l"
            ? "Sit tight, Generating Proof!"
            : status === "r"
            ? "Verifying proof"
            : status === "s"
            ? "Verified"
            : "loading",
        status: status === "s" ? "success" : status === "e" ? "error" : "info",
        duration: status !== "s" ? 100000 : 4000,
        isClosable: true,
      });
    }
  }, [loading, status, toast]);

  useEffect(() => {
    if (!inputs) return;
    const prove = async () => {
      console.log("final proof generating");
      setStatus("l");
      setLoading(true);
      try {
        const proof = await noir.generateFinalProof(inputs);
        console.log("prooof", proof);
        setProof(proof);
        setLoading(false);
        return proof;
      } catch (error) {
        setStatus("e");
        setLoading(false);
        toast({
          title: "Error calculating proof",
          status: "error",
          duration: 60 * 60 * 1000 * 24,
          isClosable: true,
        });
      }
    };
    prove();
  }, [inputs]);

  const generateProof = async (
    acc: string,
    messageToHash = "0xabfd76608112cc843dca3a31931f3974da5f9f5d32833e7817bc7e5c50c7821e"
  ) => {
    const signature = await walletClient?.signMessage({
      account: acc as `0x${string}`,
      message: messageToHash,
    });

    const hashedMessage = hashMessage(messageToHash, "hex");
    const pubKey = await recoverPublicKey({
      hash: hashedMessage,
      signature: signature as `0x${string}`,
    });

    const bb = await Barretenberg.new(cpus().length);
    await bb.pedersenInit();

    const signatureBuffer = fromHex(signature as `0x${string}`, "bytes").slice(
      0,
      64
    );
    const frArray: Fr[] = Array.from(signatureBuffer).map(
      (byte) => new Fr(BigInt(byte))
    );

    const _nullifier = await bb.pedersenHashMultiple(frArray);

    const newInputs = {
      pub_key: [...fromHex(pubKey, "bytes").slice(1)],
      signature: [...fromHex(signature as `0x${string}`, "bytes").slice(0, 64)],
      hashed_message: [...fromHex(hashedMessage, "bytes")],
      claimer_pub: acc,
      nullifier: _nullifier.toString(),
    };
    setInputs(newInputs);
    setNullifier(_nullifier.toString());
  };

  return { proof, loading, nullifier, generateProof };
}

export default useProofGenerator;
