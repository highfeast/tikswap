
import React from 'react';

import { fromHex, hashMessage, recoverPublicKey } from 'viem';
import { cpus } from 'os';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { CompiledCircuit, ProofData } from "@noir-lang/types"
import { useAccount, useConnect, useWalletClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { getCircuit } from '../utils/compile';

import circuit from "@/utils/noirstarter.json"
import { shortenEthAddress } from '@/utils/helpers';
import { Barretenberg, Fr } from '@aztec/bb.js';

function useProver({ inputs, setLoading }: any) {


}

function Component() {

    const [availableAddresses, setAvailableAddresses] = useState<`0x${string}`[]>([])
    const { data: walletClient, status: walletConnStatus } = useWalletClient()
    const { isConnected } = useAccount()
    const { connect, connectors } = useConnect({
        connector: new InjectedConnector(),
    })
    const { account, signature } = storedSignature || { account: '', signature: undefined };
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [inputs, setInputs] = useState<any>();

    const backend = new BarretenbergBackend(circuit as unknown as CompiledCircuit, { threads: navigator.hardwareConcurrency });
    const noir = new Noir(circuit as unknown as CompiledCircuit, backend);

    useEffect(() => {
        if (loading) {
            toast({
                title: status === "l" ? 'Sit tight, Generating Proof!' : status === 'r' ? "Verifying proof" : status === 's' ? 'Verified' : 'loading',
                status: status === "s" ? 'success' : status === 'e' ? 'error' : 'info',
                duration: status !== 's' ? 100000 : 4000,
                isClosable: true,
            });
        }
    }, [loading, status, toast]);

    useEffect(() => {
        if (!proof) return;
        const verify = async () => {
            setLoading(true);
            setStatus('r');
            try {
                await noir.verifyFinalProof(proof);
                setStatus('s');
            } catch (error) {
                setStatus('e');
            }
            setLoading(false);
        }
        verify();
    }, [proof]);

    useEffect(() => {
        if (!inputs) return;
        const prove = async () => {
            console.log("final proof generating")
            setStatus("l")
            setLoading(true)
            try {
                const proof = await noir.generateFinalProof(inputs);
                console.log("prooof", proof)
                setProof(proof);
                return proof;
            } catch (error) {
                setStatus('e')
                setLoading(false)
                toast({
                    title: 'Error calculating proof',
                    status: 'error',
                    duration: 60 * 60 * 1000 * 24,
                    isClosable: true,
                });
            }
        }
        prove();
    }, [inputs]);


    let messageToHash = '0xabfd76608112cc843dca3a31931f3974da5f9f5d32833e7817bc7e5c50c7821e';

    const signData = async (acc: string) => {
        const signature = await walletClient?.signMessage({ account: acc as `0x${string}`, message: messageToHash })
        setStoredSignature({ signature, account: acc });
    }


    const claim = async (acc: string) => {
        const hashedMessage = hashMessage(messageToHash, "hex");

        const pubKey = await recoverPublicKey({ hash: hashedMessage, signature: signature as `0x${string}` });

        const bb = await Barretenberg.new(cpus().length);
        await bb.pedersenInit();

        const signatureBuffer = fromHex(signature as `0x${string}`, "bytes").slice(0, 64)
        const frArray: Fr[] = Array.from(signatureBuffer).map(byte => new Fr(BigInt(byte)));

        const nullifier = await bb.pedersenHashMultiple(frArray);

        const inputs = {
            pub_key: [...fromHex(pubKey, "bytes").slice(1)],
            signature: [...fromHex(signature as `0x${string}`, "bytes").slice(0, 64)],
            hashed_message: [...fromHex(hashedMessage, "bytes")],
            claimer_pub: acc,
            nullifier: nullifier.toString()
        };
        console.log("claimes_key", inputs);
        setInputs(inputs)
    };

    const initAddresses = async () => {
        const addresses = await walletClient?.getAddresses()
        setAvailableAddresses(addresses || [])
    }

    useEffect(() => {
        if (isConnected) {
            initAddresses();
        }
    }, [walletConnStatus])

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
        await tikSwapClient.addEvent('Test Event', '2024-02-18', 1, 0);
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

            {availableAddresses.map(acc => (
                <React.Fragment key={acc}>
                    {/* we can pass a hash of the event to the generate proof */}
                    <Button onClick={() => generateProof(acc)} isLoading={generatingLoading}>
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
                    <Button onClick={() => verifyProof(proof)} isLoading={verifyingLoading}>
                        Verify Proof
                    </Button>
                    <br />
                </React.Fragment>
            )}

            <Button onClick={testTikSwapClient}>Create Smart Wallet</Button>

        </VStack>
    );
}

export default Component;    
