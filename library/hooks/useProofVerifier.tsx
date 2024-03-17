import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { Noir } from '@noir-lang/noir_js';
import { CompiledCircuit, ProofData } from "@noir-lang/types";
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import circuit from "@/utils/noirstarter.json"

function useProofVerifier() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const toast = useToast();
    const backend = new BarretenbergBackend(circuit as unknown as CompiledCircuit, { threads: navigator.hardwareConcurrency });
    const noir = new Noir(circuit as unknown as CompiledCircuit, backend);
    const verifyProof = async (proof: ProofData) => {
        setLoading(true);
        setStatus('r');
        try {
            await noir.verifyFinalProof(proof);
            setStatus('s');
        } catch (error) {
            setStatus('e');
        }
        setLoading(false);
    };

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

    return { loading, status, verifyProof };
}

export default useProofVerifier;
