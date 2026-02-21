# Morpho Oracle Manipulation Test - SUSHI/WETH

## ⚠️ DISCLAIMER
This project is for **EDUCATIONAL AND TESTING PURPOSES ONLY**. Oracle manipulation on mainnet is illegal and unethical. This code should only be used in controlled testing environments.

## Overview
Hardhat testing environment for analyzing oracle manipulation vulnerabilities in the Morpho protocol's SUSHI/WETH market using Alchemy API for mainnet forking.

## Features
- ✅ Mainnet forking with Alchemy API
- ✅ Oracle price analysis
- ✅ Flash loan simulation
- ✅ Price impact calculations
- ✅ Morpho protocol integration
- ✅ Security recommendations

## Setup

### Install Dependencies
```bash
npm install
```

### Configuration
The project uses your Alchemy API key: `EP0hyVI7lae6KHBVkKPf`

Mainnet fork is configured in `hardhat.config.js`

## Running Tests

### Compile Contracts
```bash
npm run compile
```

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npx hardhat test test/OracleManipulation.test.js
```

## Test Coverage

### 1. Oracle Price Analysis
- Fetches current SUSHI/WETH price from Uniswap V2
- Analyzes reserve ratios
- Tests price getter functions

### 2. Flash Loan Simulation
- Simulates flash loan availability
- Tests whale account impersonation
- Validates fund transfers

### 3. Price Impact Analysis
- Calculates price impact of large swaps
- Simulates 10% pool manipulation
- Measures slippage and price deviation

### 4. Morpho Protocol Integration
- Checks Morpho market data
- Analyzes lending/borrowing positions
- Tests oracle integration points

### 5. Security Analysis
- Identifies vulnerabilities
- Provides mitigation strategies
- Recommends security improvements

## Key Contracts

### OracleManipulator.sol
Testing contract that includes:
- Flash loan receiver implementation
- Price manipulation functions
- Uniswap V2 integration
- Event logging for analysis

## Important Addresses

- **SUSHI Token**: `0x6B3595068778DD592e39A122f4f5a5cF09C90fE2`
- **WETH Token**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **SUSHI/WETH Pair**: `0x795065dCc9f64b5614C407a6EFDC400DA6221FB0`
- **Aave Lending Pool**: `0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9`
- **Morpho Aave V2**: `0x777777c9898D384F785Ee44Acfe945efDFf5f3E0`

## Security Recommendations

1. **Use Chainlink Oracles**: More resistant to manipulation
2. **Implement TWAP**: Time-weighted average prices with longer windows
3. **Multi-source Price Feeds**: Combine multiple oracle sources
4. **Circuit Breakers**: Halt operations on abnormal price movements
5. **Liquidity Checks**: Validate sufficient liquidity before operations

## Network Configuration

The project forks Ethereum mainnet at block 18,500,000 for consistency. You can modify this in `hardhat.config.js`.

## Troubleshooting

### RPC Rate Limits
If you hit Alchemy rate limits, consider:
- Using a different block number
- Reducing test frequency
- Upgrading your Alchemy plan

### Gas Issues
Hardhat fork provides unlimited gas by default. If you encounter issues:
```javascript
networks: {
  hardhat: {
    gas: 12000000,
    blockGasLimit: 12000000
  }
}
```

## License
MIT - For educational purposes only

## Resources
- [Morpho Documentation](https://docs.morpho.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Alchemy Documentation](https://docs.alchemy.com/)
- [Flash Loan Security](https://blog.chain.link/flash-loans/)