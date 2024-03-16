// import { CompiledCircuit } from "@noir-lang/types";

const { cpus } = require('os');

const { expect } = require('chai');
// const hre  = require("hardhat");
if (!hre) {
  const hre = require('hardhat');
}
const { Barretenberg, Fr } = require('@aztec/bb.js');

// import { ethers } from 'ethers';

const { WalletClient, pad, fromHex, hashMessage, http, recoverPublicKey, toHex } = require('viem');
const { BarretenbergBackend } = require('@noir-lang/backend_barretenberg');
const { Noir } = require('@noir-lang/noir_js');
const circuit = require('../circuit/target/noirstarter.json');

declare var PublicClient: any;

class TicketSwap {
  public address: `0x${string}` = '0x';

  constructor(
    private tokenAddress: string, //`0x${string}`,
    private _verifierAddress: string,
  ) {}

  async deploy() {
    const ticketSwap = await hre.viem.deployContract('TikSwap' as never, [
      this._verifierAddress,
      this.tokenAddress,
    ]);
    this.address = ticketSwap.address;
  }

  async contract() {
    return await hre.viem.getContractAt('TikSwap', this.address);
  }
}
describe('Setup', () => {
  let publicClient: any;
  let ticketSwap: TicketSwap;
  let messageToHash: string = '0xabfd76608112cc843dca3a31931f3974da5f9f5d32833e7817bc7e5c50c7821e';
  let hashedMessage: `0x${string}`;

  before(async () => {
    publicClient = await hre.viem.getPublicClient();

    const verifier = await hre.viem.deployContract('UltraVerifier');
    console.log(`Verifier deployed to ${verifier.address}`);

    hashedMessage = hashMessage(messageToHash, 'hex'); // keccak of "signthis"

    ticketSwap = new TicketSwap('0x1d4343d35f0E0e14C14115876D01dEAa4792550b', verifier.address);
    await ticketSwap.deploy();

    console.log(`Ticket swap deployed to ${ticketSwap.address}`);
  });

  describe('Ticket Swap tests', () => {
    let user1: any;
    let backend: any;
    let noir: any;

    before(async () => {
      // only user1 is an eligible user
      [user1] = await hre.viem.getWalletClients();
      backend = new BarretenbergBackend(circuit as unknown as any, { threads: 8 });
      noir = new Noir(circuit as unknown as any, backend);
    });

    const getClaimInputs = async ({ user }: { user: any }) => {
      const signature = await user.signMessage({
        account: user.account!.address,
        message: messageToHash,
      });

      const bb = await Barretenberg.new(cpus().length);
      await bb.pedersenInit();

      const signatureBuffer = fromHex(signature as `0x${string}`, 'bytes').slice(0, 64);
      const frArray: any[] = Array.from(signatureBuffer).map(byte => new Fr(BigInt(byte as any)));

      const nullifier = await bb.pedersenHashMultiple(frArray);

      // const signatureBuffer = fromHex(signature as `0x${string}`, 'bytes').slice(0, 64);
      const pubKey = await recoverPublicKey({ hash: hashedMessage, signature });

      return {
        pub_key: [...fromHex(pubKey, 'bytes').slice(1)],
        signature: [...fromHex(signature as `0x${string}`, 'bytes').slice(0, 64)],
        hashed_message: [...fromHex(hashedMessage, 'bytes')],
        claimer_pub: user.account!.address,
        nullifier: nullifier.toString(),
      };
    };

    describe('Eligible user', () => {
      let proof: any;

      it('Generates a valid claim', async () => {
        const inputs = await getClaimInputs({ user: user1 });
        proof = await noir.generateFinalProof(inputs);
      });

      it('Verifies a valid claim off-chain', async () => {
        const verification = await noir.verifyFinalProof(proof);
        expect(verification).to.be.true;
      });

      // ON-CHAIN VERIFICATION FAILS, CHECK https://github.com/noir-lang/noir/issues/3245
      it.skip('Verifies a valid claim on-chain', async () => {
        const { claimer_pub, hashed_message } = await getClaimInputs({ user: user1 });
        const ad = await ticketSwap.contract();
        // const x = await ad.write.verifyProof([
        //   toHex(proof.proof),
        //   toHex(hashed_message),
        //   claimer_pub,
        // ]);
      });
    });
  });
});
