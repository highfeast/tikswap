const { toBytes, stringToBytes, parseEther } = require("viem");

if (!expect) {
  const { expect } = require("chai");
}

if (!toHex) {
  const { toHex } = require("viem");
}

//@ts-ignore
class TicketSwap {
  public address: `0x${string}` = "0x";

  constructor() {}

  async deploy() {
    const ticketSwap = await hre.viem.deployContract("TikSwap" as never, []);
    this.address = ticketSwap.address;
  }

  async contract() {
    return await hre.viem.getContractAt("TikSwap", this.address);
  }
}

describe("TikSwap", function () {
  let publicClient: any;
  let ticketSwap: TicketSwap;

  before(async () => {
    publicClient = await hre.viem.getPublicClient();

    const verifier = await hre.viem.deployContract("UltraVerifier");
    console.log(`Verifier deployed to ${verifier.address}`);

    ticketSwap = new TicketSwap();
    await ticketSwap.deploy();

    console.log(`Ticket swap deployed to ${ticketSwap.address}`);
  });

  it("Should add an event with maximum tickets as 1", async function () {
    const ad = await ticketSwap.contract();
    await ad.write.addEvent(["Test Event", "2024-03-18", 1, 0]);
    const event = await ad.read.eventInfo([1]);
    // console.log(event);
    if (event) {
      expect(event[0]).to.equal("Test Event");
      expect(event[1]).to.equal("2024-03-18");
    }
  });

  it("Should allow a user to purchase a ticket after approval and payment", async function () {
    const ad = await ticketSwap.contract();
    await ad.write.addEvent(["Test Event", "2024-03-14", 1, 0]);
    await ad.write.purchaseTicket([
      1,
      toHex("0x48656c6c6f20576f726c6421", { size: 32 }),
    ]);

    const event = await ad.read.eventInfo([1]);
    if (event) {
      console.log("ecount down", event.ticketCount);
      const nullifierExists = await ad.read.nullifiers([
        1,
        toHex("0x48656c6c6f20576f726c6421", { size: 32 }),
      ]);
      expect(nullifierExists).to.be.true;
    }
  });
});
