const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("\n🚀 Starting Live Oracle Manipulation Test...\n");
  console.log("=" .repeat(60));
  
  // Contract addresses
  const SUSHI_TOKEN = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2';
  const WETH_TOKEN = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const SUSHI_WETH_PAIR = '0x795065dCc9f64b5614C407a6EFDC400DA6221FB0';
  const AAVE_LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
  const MORPHO_AAVE_V2 = '0x777777c9898D384F785Ee44Acfe945efDFf5f3E0';
  
  try {
    // Step 1: Deploy OracleManipulator
    console.log("\n📝 Step 1: Deploying OracleManipulator Contract...");
    const OracleManipulator = await ethers.getContractFactory("OracleManipulator");
    const manipulator = await OracleManipulator.deploy(AAVE_LENDING_POOL);
    await manipulator.deployed();
    console.log("✅ OracleManipulator deployed to:", manipulator.address);
    
    // Step 2: Get Uniswap Pair Contract
    console.log("\n📊 Step 2: Fetching SUSHI/WETH Pair Data...");
    const pairABI = [
      "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
      "function token0() external view returns (address)",
      "function token1() external view returns (address)"
    ];
    const pair = await ethers.getContractAt(pairABI, SUSHI_WETH_PAIR);
    
    // Step 3: Get current reserves and price
    console.log("\n💰 Step 3: Analyzing Current Market State...");
    const reserves = await pair.getReserves();
    const token0 = await pair.token0();
    
    let sushiReserve, wethReserve;
    if (token0.toLowerCase() === SUSHI_TOKEN.toLowerCase()) {
      sushiReserve = reserves[0];
      wethReserve = reserves[1];
    } else {
      sushiReserve = reserves[1];
      wethReserve = reserves[0];
    }
    
    const price = wethReserve.mul(ethers.utils.parseEther('1')).div(sushiReserve);
    
    console.log("=" .repeat(60));
    console.log("📈 CURRENT MARKET STATE");
    console.log("=" .repeat(60));
    console.log("SUSHI Reserve:", ethers.utils.formatEther(sushiReserve), "SUSHI");
    console.log("WETH Reserve:", ethers.utils.formatEther(wethReserve), "WETH");
    console.log("Current Price:", ethers.utils.formatEther(price), "WETH per SUSHI");
    console.log("=" .repeat(60));
    
    // Step 4: Get price through manipulator contract
    console.log("\n🔍 Step 4: Verifying Price Through Manipulator Contract...");
    const contractPrice = await manipulator.getPrice(SUSHI_WETH_PAIR);
    console.log("✅ Contract Price:", ethers.utils.formatEther(contractPrice), "WETH per SUSHI");
    
    // Step 5: Calculate price impact simulation
    console.log("\n⚡ Step 5: Simulating Price Impact Analysis...");
    const swapPercentage = 10; // 10% of pool
    const swapAmount = sushiReserve.div(swapPercentage);
    
    // Calculate output using constant product formula: x * y = k
    const amountOut = wethReserve.mul(swapAmount).div(sushiReserve.add(swapAmount));
    
    const newSushiReserve = sushiReserve.add(swapAmount);
    const newWethReserve = wethReserve.sub(amountOut);
    const priceAfter = newWethReserve.mul(ethers.utils.parseEther('1')).div(newSushiReserve);
    
    const priceImpact = price.sub(priceAfter).mul(10000).div(price);
    
    console.log("=" .repeat(60));
    console.log("💥 PRICE IMPACT SIMULATION (10% Pool Swap)");
    console.log("=" .repeat(60));
    console.log("Swap Amount:", ethers.utils.formatEther(swapAmount), "SUSHI");
    console.log("Expected Output:", ethers.utils.formatEther(amountOut), "WETH");
    console.log("Price Before:", ethers.utils.formatEther(price), "WETH");
    console.log("Price After:", ethers.utils.formatEther(priceAfter), "WETH");
    console.log("Price Impact:", (priceImpact.toNumber() / 100).toFixed(2), "%");
    console.log("=" .repeat(60));
    
    // Step 6: Security Analysis
    console.log("\n🔒 Step 6: Security Vulnerability Analysis...");
    console.log("=" .repeat(60));
    console.log("⚠️  SECURITY FINDINGS");
    console.log("=" .repeat(60));
    console.log("1. Oracle Type: Uniswap V2 spot price");
    console.log("   Risk: HIGH - Vulnerable to flash loan manipulation");
    console.log("");
    console.log("2. Flash Loan Availability: YES");
    console.log("   Risk: HIGH - Large liquidity pools available (Aave, dYdX)");
    console.log("");
    console.log("3. Price Impact: " + (priceImpact.toNumber() / 100).toFixed(2) + "% for 10% swap");
    console.log("   Risk: MEDIUM - Significant price movement possible");
    console.log("");
    console.log("4. Morpho Integration: Uses external price oracles");
    console.log("   Risk: Depends on oracle implementation");
    console.log("=" .repeat(60));
    
    // Step 7: Recommendations
    console.log("\n✅ Step 7: Security Recommendations...");
    console.log("=" .repeat(60));
    console.log("🛡️  MITIGATION STRATEGIES");
    console.log("=" .repeat(60));
    console.log("1. Use Chainlink Price Feeds");
    console.log("   - Decentralized oracle network");
    console.log("   - Resistant to manipulation");
    console.log("");
    console.log("2. Implement TWAP (Time-Weighted Average Price)");
    console.log("   - Use longer time windows (30+ minutes)");
    console.log("   - Reduces impact of temporary price spikes");
    console.log("");
    console.log("3. Multi-Source Price Validation");
    console.log("   - Combine Uniswap, Chainlink, and other sources");
    console.log("   - Reject outliers beyond threshold");
    console.log("");
    console.log("4. Circuit Breakers");
    console.log("   - Halt operations on >X% price movement");
    console.log("   - Implement cooldown periods");
    console.log("");
    console.log("5. Liquidity Depth Checks");
    console.log("   - Validate minimum liquidity requirements");
    console.log("   - Monitor reserve ratios");
    console.log("=" .repeat(60));
    
    console.log("\n✅ Live Test Completed Successfully!\n");
    
  } catch (error) {
    console.error("\n❌ Error during test execution:");
    console.error(error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });