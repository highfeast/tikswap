import { ENTRYPOINT_ADDRESSES, IPaymaster, PaymasterMode, createPaymaster, createSmartAccountClient } from "@biconomy/account";
import ethers, { BrowserProvider, Contract, Interface, Signer, } from "ethers";
import contractAbi from "@/utils/TikSwap.json";
import { Providers } from "@/components/providers";
import { encodeFunctionData, getAddress, toHex, createWalletClient, custom } from "viem";

import { rpc } from "viem/utils";

const _contractAddress = "0xd03F7346e8549A20D56d782753824a9D120F5Ee5";


class TikSwapClient {
    private contract: any;
    private smartWallet: any;

    constructor() {
        this.init();
    }

    private async init() {
        const ethereum = global?.window?.ethereum;
        if (!ethereum || !ethereum.isMetaMask) return;
        const provider = new BrowserProvider(ethereum);
        try {
            this.contract = new Contract(_contractAddress, contractAbi, await provider.getSigner());

            console.log("Contract Initialized:", this.contract);
        } catch (error) {
            console.error("Error initializing contract:", error);
        }
    }



    private async loadContract(provider: any,) {
        return new Contract(_contractAddress, contractAbi, provider);
    }

    private async getSigner(provider: any) {
        if (provider) {
            return provider.getSigner();
        } else {
            throw new Error("Unsupported provider type");
        }
    }

    async addEvent(title: string, date: string, maxTickets: number, price: number) {
        await this.init()
        console.log("Adding event:", title);
        const ethereum = global?.window?.ethereum;
        if (!ethereum || !ethereum.isMetaMask) return;

        console.log("Adding event:", title);
        try {
            // Call the addEvent method on the contract directly
            const tx = await this.contract.addEvent(title, date, maxTickets, price);
            // Wait for the transaction to be mined
            await tx.wait();
            console.log("Event added successfully.");
        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

}

export { TikSwapClient };




