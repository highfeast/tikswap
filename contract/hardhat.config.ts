// import '@nomicfoundation/hardhat-toolbox-viem';
// import '@nomicfoundation/hardhat-chai-matchers';
// import "@nomicfoundation/hardhat-viem";

// import { HardhatUserConfig } from 'hardhat/config';
require('@nomicfoundation/hardhat-toolbox-viem');
require('@nomicfoundation/hardhat-chai-matchers');

require('@nomicfoundation/hardhat-viem');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: { enabled: true, runs: 5000 },
    },
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_KEY as string}`,
      accounts: [process.env.MUMBAI_DEPLOYER_PRIVATE_KEY as string],
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
  paths: {
    sources: './circuit/contract',
  },
  mocha: {
    timeout: 4000000,
  },
};

module.exports = config;
