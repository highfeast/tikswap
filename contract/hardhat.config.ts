require('@nomicfoundation/hardhat-toolbox-viem');
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-viem');

const { HardhatUserConfig } = require('hardhat/config');
require('@nomicfoundation/hardhat-toolbox-viem');
require('@nomicfoundation/hardhat-chai-matchers');

require('@nomicfoundation/hardhat-viem');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: { enabled: true, runs: 5000 },
    },
  },
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },

  paths: {
    sources: '/circuit/contracts',
  },
  mocha: {
    timeout: 4000000,
  },
};

module.exports = config;
