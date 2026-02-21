# 🚀 Quick Start Guide - Run Live Test

## Prerequisites
- Node.js 16+ installed
- Git installed
- Terminal/Command Prompt

## Run Live Test in 3 Steps

### Step 1: Clone & Install
```bash
git clone https://github.com/arp123-456/morpho-oracle-manipulation-test.git
cd morpho-oracle-manipulation-test
npm install
```

### Step 2: Run Live Test
```bash
npx hardhat run scripts/run-live-test.js --network hardhat
```

### Step 3: View Results
The script will output:
- ✅ Current SUSHI/WETH market state
- ✅ Price impact simulations
- ✅ Security vulnerability analysis
- ✅ Mitigation recommendations

## Expected Output

```
🚀 Starting Live Oracle Manipulation Test...

📝 Step 1: Deploying OracleManipulator Contract...
✅ OracleManipulator deployed to: 0x...

📊 Step 2: Fetching SUSHI/WETH Pair Data...

💰 Step 3: Analyzing Current Market State...
============================================================
📈 CURRENT MARKET STATE
============================================================
SUSHI Reserve: XXXXX.XX SUSHI
WETH Reserve: XXX.XX WETH
Current Price: 0.00XXX WETH per SUSHI
============================================================

🔍 Step 4: Verifying Price Through Manipulator Contract...
✅ Contract Price: 0.00XXX WETH per SUSHI

⚡ Step 5: Simulating Price Impact Analysis...
============================================================
💥 PRICE IMPACT SIMULATION (10% Pool Swap)
============================================================
Swap Amount: XXXX.XX SUSHI
Expected Output: XX.XX WETH
Price Before: 0.00XXX WETH
Price After: 0.00XXX WETH
Price Impact: X.XX %
============================================================

🔒 Step 6: Security Vulnerability Analysis...
🛡️ Step 7: Security Recommendations...

✅ Live Test Completed Successfully!
```

## Alternative: Run Full Test Suite
```bash
npm test
```

## Troubleshooting

### Error: Cannot find module
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Network timeout
- Check your internet connection
- Alchemy API may be rate-limited
- Try again in a few minutes

### Error: Compilation failed
```bash
npx hardhat clean
npx hardhat compile
```

## What This Test Does

1. **Deploys** testing contract to forked mainnet
2. **Fetches** real SUSHI/WETH liquidity pool data
3. **Calculates** price impact of manipulation attempts
4. **Analyzes** security vulnerabilities
5. **Provides** mitigation recommendations

## ⚠️ Important Notes

- This uses **mainnet fork** (no real funds)
- All tests run in **isolated environment**
- For **educational purposes only**
- Never attempt on real mainnet

## Need Help?

- Check the main [README.md](README.md)
- Review test files in `/test` directory
- Examine contract in `/contracts` directory