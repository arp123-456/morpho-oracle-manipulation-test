// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUniswapV2Pair {
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

interface ILendingPool {
    function flashLoan(
        address receiverAddress,
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata modes,
        address onBehalfOf,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

/**
 * @title OracleManipulator
 * @notice Testing contract for oracle manipulation scenarios
 * @dev FOR TESTING PURPOSES ONLY - DO NOT USE IN PRODUCTION
 */
contract OracleManipulator is IFlashLoanReceiver {
    address public owner;
    ILendingPool public lendingPool;
    
    event PriceManipulated(address indexed pair, uint256 oldPrice, uint256 newPrice);
    event FlashLoanExecuted(address[] assets, uint256[] amounts);
    
    constructor(address _lendingPool) {
        owner = msg.sender;
        lendingPool = ILendingPool(_lendingPool);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    /**
     * @notice Initiate flash loan for oracle manipulation test
     * @param assets Array of asset addresses to borrow
     * @param amounts Array of amounts to borrow
     */
    function initiateFlashLoan(
        address[] calldata assets,
        uint256[] calldata amounts
    ) external onlyOwner {
        uint256[] memory modes = new uint256[](assets.length);
        // Mode 0: no debt, just flash loan
        
        lendingPool.flashLoan(
            address(this),
            assets,
            amounts,
            modes,
            address(this),
            "",
            0
        );
    }
    
    /**
     * @notice Flash loan callback - execute manipulation here
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(lendingPool), "Invalid caller");
        
        emit FlashLoanExecuted(assets, amounts);
        
        // Manipulation logic would go here
        // For testing: just approve repayment
        for (uint i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i];
            IERC20(assets[i]).approve(address(lendingPool), amountOwing);
        }
        
        return true;
    }
    
    /**
     * @notice Manipulate Uniswap V2 pair price
     * @param pair The Uniswap V2 pair address
     * @param amount0Out Amount of token0 to swap out
     * @param amount1Out Amount of token1 to swap out
     */
    function manipulatePrice(
        address pair,
        uint256 amount0Out,
        uint256 amount1Out
    ) external onlyOwner {
        (uint112 reserve0Before, uint112 reserve1Before,) = IUniswapV2Pair(pair).getReserves();
        uint256 priceBefore = (uint256(reserve1Before) * 1e18) / uint256(reserve0Before);
        
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), "");
        
        (uint112 reserve0After, uint112 reserve1After,) = IUniswapV2Pair(pair).getReserves();
        uint256 priceAfter = (uint256(reserve1After) * 1e18) / uint256(reserve0After);
        
        emit PriceManipulated(pair, priceBefore, priceAfter);
    }
    
    /**
     * @notice Get current price from Uniswap pair
     */
    function getPrice(address pair) external view returns (uint256) {
        (uint112 reserve0, uint112 reserve1,) = IUniswapV2Pair(pair).getReserves();
        return (uint256(reserve1) * 1e18) / uint256(reserve0);
    }
    
    receive() external payable {}
}