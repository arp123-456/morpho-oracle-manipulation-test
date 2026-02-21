require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/EP0hyVI7lae6KHBVkKPf`,
        blockNumber: 18500000 // Pin to specific block for consistency
      },
      chainId: 1
    }
  },
  mocha: {
    timeout: 100000
  }
};