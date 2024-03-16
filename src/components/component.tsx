import { useState, useEffect, useMemo, useContext } from 'react';
import { Box, Button, Heading, useToast, List, ListItem, Text, VStack, } from '@chakra-ui/react'


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
    const [proof, setProof] = useState<ProofData>();
    const toast = useToast();
    // const noir = useMemo(() => {
    //     const backend = new BarretenbergBackend(circuit as unknown as CompiledCircuit, { threads: 8 })
    //     return (new Noir(circuit as unknown as CompiledCircuit, backend))
    // }, [circuit])


    const [storedSignature, setStoredSignature] = useState<{ account: string, signature: string | undefined }>();
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



    return (

        <VStack alignItems={"center"} justifyContent={"center"} bg="white" minH="70vh">
            <Heading>TikSwap </Heading>

            {availableAddresses.map(acc => <Button onClick={() => signData(acc)}>Sign with connected account</Button>)}


            {storedSignature && <Text fontSize={"xs"}>Signature captured: for {shortenEthAddress(storedSignature!.account)}</Text>}

            <br />

            {storedSignature && availableAddresses.map(acc =>
                <>
                    <Button onClick={() => claim(acc)}
                        isLoading={loading}
                    >Claim Ticket</Button><br /></>)}

        </VStack>
    );
}

export default Component;    
