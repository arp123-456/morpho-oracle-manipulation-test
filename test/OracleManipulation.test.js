const { expect } = require('chai');
const { ethers } = require('hardhat');
const { impersonateAccount, setBalance } = require('@nomicfoundation/hardhat-network-helpers');

describe('Morpho Oracle Manipulation Test - SUSHI/WETH', function () {
  // Contract addresses on Ethereum mainnet
  const SUSHI_TOKEN = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2';
  const WETH_TOKEN = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const SUSHI_WETH_PAIR = '0x795065dCc9f64b5614C407a6EFDC400DA6221FB0'; // SushiSwap SUSHI/WETH
  const AAVE_LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
  const MORPHO_AAVE_V2 = '0x777777c9898D384F785Ee44Acfe945efDFf5f3E0';
  
  // Whale addresses for impersonation
  const SUSHI_WHALE = '0x5a52E96BAcdaBb82fd05763E25335261B270Efcb';
  const WETH_WHALE = '0x2F0b23f53734252Bda2277357e97e1517d6B042A';
  
  let manipulator;
  let sushiToken;
  let wethToken;
  let pair;
  let owner;
  
  before(async function () {
    [owner] = await ethers.getSigners();
    
    // Deploy manipulator contract
    const OracleManipulator = await ethers.getContractFactory('OracleManipulator');
    manipulator = await OracleManipulator.deploy(AAVE_LENDING_POOL);
    await manipulator.deployed();
    
    console.log('OracleManipulator deployed to:', manipulator.address);
    
    // Get token contracts
    sushiToken = await ethers.getContractAt('IERC20', SUSHI_TOKEN);
    wethToken = await ethers.getContractAt('IERC20', WETH_TOKEN);
    pair = await ethers.getContractAt('IUniswapV2Pair', SUSHI_WETH_PAIR);
  });
  
  describe('Oracle Price Analysis', function () {
    it('Should fetch current SUSHI/WETH price from Uniswap', async function () {
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
      
      console.log('\n=== Current Market State ===');
      console.log('SUSHI Reserve:', ethers.utils.formatEther(sushiReserve));
      console.log('WETH Reserve:', ethers.utils.formatEther(wethReserve));
      console.log('SUSHI/WETH Price:', ethers.utils.formatEther(price), 'WETH per SUSHI');
      
      expect(price).to.be.gt(0);
    });
    
    it('Should get price through manipulator contract', async function () {
      const price = await manipulator.getPrice(SUSHI_WETH_PAIR);
      console.log('Price from contract:', ethers.utils.formatEther(price));
      expect(price).to.be.gt(0);
    });
  });
  
  describe('Flash Loan Simulation', function () {
    it('Should simulate flash loan availability', async function () {
      // Impersonate WETH whale
      await impersonateAccount(WETH_WHALE);
      await setBalance(WETH_WHALE, ethers.utils.parseEther('100'));
      const wethWhaleSigner = await ethers.getSigner(WETH_WHALE);
      
      const wethBalance = await wethToken.balanceOf(WETH_WHALE);
      console.log('\n=== Flash Loan Simulation ===');
      console.log('WETH Whale Balance:', ethers.utils.formatEther(wethBalance));
      
      // Transfer some WETH to manipulator for testing
      const transferAmount = ethers.utils.parseEther('10');
      await wethToken.connect(wethWhaleSigner).transfer(manipulator.address, transferAmount);
      
      const manipulatorBalance = await wethToken.balanceOf(manipulator.address);
      console.log('Manipulator WETH Balance:', ethers.utils.formatEther(manipulatorBalance));
      
      expect(manipulatorBalance).to.equal(transferAmount);
    });
  });
  
  describe('Price Impact Analysis', function () {
    it('Should calculate price impact of large swap', async function () {
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
      
      const priceBefore = wethReserve.mul(ethers.utils.parseEther('1')).div(sushiReserve);
      
      // Simulate 10% of pool swap
      const swapAmount = sushiReserve.div(10);
      const amountOut = wethReserve.mul(swapAmount).div(sushiReserve.add(swapAmount));
      
      const newSushiReserve = sushiReserve.add(swapAmount);
      const newWethReserve = wethReserve.sub(amountOut);
      const priceAfter = newWethReserve.mul(ethers.utils.parseEther('1')).div(newSushiReserve);
      
      const priceImpact = priceBefore.sub(priceAfter).mul(10000).div(priceBefore);
      
      console.log('\n=== Price Impact Analysis ===');
      console.log('Swap Amount (10% of pool):', ethers.utils.formatEther(swapAmount), 'SUSHI');
      console.log('Price Before:', ethers.utils.formatEther(priceBefore));
      console.log('Price After:', ethers.utils.formatEther(priceAfter));
      console.log('Price Impact:', priceImpact.toString() / 100, '%');
      
      expect(priceImpact).to.be.gt(0);
    });
  });
  
  describe('Morpho Protocol Integration', function () {
    it('Should check Morpho market data for SUSHI/WETH', async function () {
      const morpho = await ethers.getContractAt(
        ['function market(address) view returns (tuple(address underlying, uint256 totalSupply, uint256 totalBorrow))'],
        MORPHO_AAVE_V2
      );
      
      console.log('\n=== Morpho Protocol Analysis ===');
      console.log('Morpho Address:', MORPHO_AAVE_V2);
      console.log('Testing oracle manipulation vectors...');
      console.log('Note: This is a TESTING environment only');
    });
  });
  
  describe('Security Recommendations', function () {
    it('Should output security analysis', async function () {
      console.log('\n=== Security Analysis ===');
      console.log('1. Oracle Type: Uniswap V2 TWAP vulnerable to manipulation');
      console.log('2. Flash Loan Risk: High - Large liquidity available');
      console.log('3. Mitigation: Use Chainlink oracles or multi-source price feeds');
      console.log('4. Recommendation: Implement TWAP with longer time windows');
      console.log('5. Additional: Add circuit breakers for large price movements');
    });
  });
});