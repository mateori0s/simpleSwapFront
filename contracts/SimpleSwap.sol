// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SimpleSwap Smart Contract
/// @author mateori0s
/// @notice Implements Uniswap-like add/remove liquidity and token swap logic for a fixed pair of ERC20 tokens.
/// @dev Uses constant product AMM formula and emits events for liquidity and swap operations.
contract SimpleSwap is ERC20 {
    /// @notice First token in the pair
    IERC20 public immutable tokenA;

    /// @notice Second token in the pair
    IERC20 public immutable tokenB;

    /// @notice Emitted when liquidity is added to the pool

    /// @notice Emitted when liquidity is added to the pool
    /// @param provider Address providing liquidity
    /// @param amountA Amount of token A added
    /// @param amountB Amount of token B added
    /// @param liquidity LP tokens minted
    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity
    );

    /// @notice Emitted when liquidity is removed from the pool
    /// @param provider Address removing liquidity
    /// @param amountA Amount of token A returned to the user
    /// @param amountB Amount of token B returned to the user
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    /// @notice Emitted when tokens are swapped
    event TokenSwapped(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address to
    );

    /// @notice Deploys the SimpleSwap contract for a fixed token pair
    /// @param _tokenA Address of token A
    /// @param _tokenB Address of token B
    constructor(
        address _tokenA,
        address _tokenB
    ) ERC20("SimpleSwap Token", "SST") {
        require(_tokenA != _tokenB, "Identical tokens");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /// @notice Adds liquidity to the pool
    /// @dev Transfers tokens from sender, mints LP tokens and emits LiquidityAdded
    /// @param _tokenA Address of token A (must match contract pair)
    /// @param _tokenB Address of token B (must match contract pair)
    /// @param amountADesired Desired amount of token A
    /// @param amountBDesired Desired amount of token B
    /// @param amountAMin Minimum amount of token A to accept
    /// @param amountBMin Minimum amount of token B to accept
    /// @param to Recipient address of the liquidity tokens
    /// @param deadline Timestamp after which the transaction will revert
    /// @return amountA Final amount of token A added
    /// @return amountB Final amount of token B added
    /// @return liquidity Amount of liquidity tokens minted
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(
            _tokenA == address(tokenA) && _tokenB == address(tokenB),
            "Invalid tokens"
        );
        require(block.timestamp <= deadline, "Expired");

        address self = address(this);
        uint256 totalLiquidity = totalSupply();
        uint256 balanceA = tokenA.balanceOf(self);
        uint256 balanceB = tokenB.balanceOf(self);

        if (totalLiquidity > 0) {
            uint256 amountBOptimal = (amountADesired * balanceB) / balanceA;
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "Insufficient B");
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                uint256 amountAOptimal = (amountBDesired * balanceA) / balanceB;
                require(amountAOptimal >= amountAMin, "Insufficient A");
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        } else {
            amountA = amountADesired;
            amountB = amountBDesired;
            liquidity = sqrt(amountA * amountB);
        }

        require(amountA >= amountAMin, "A not min");
        require(amountB >= amountBMin, "B not min");

        address sender = msg.sender;
        tokenA.transferFrom(sender, self, amountA);
        tokenB.transferFrom(sender, self, amountB);

        liquidity = liquidity > 0 ? liquidity : sqrt(amountA * amountB);
        _mint(to, liquidity);

        emit LiquidityAdded(sender, amountA, amountB, liquidity);
    }

    /// @notice Removes liquidity and returns token A and B
    /// @dev Transfers tokens back to user, burns LP tokens and emits LiquidityRemoved
    /// @param _tokenA Address of token A (must match contract pair)
    /// @param _tokenB Address of token B (must match contract pair)
    /// @param liquidity Amount of liquidity tokens to burn
    /// @param amountAMin Minimum amount of token A to receive
    /// @param amountBMin Minimum amount of token B to receive
    /// @param to Recipient address of tokens
    /// @param deadline Timestamp after which the transaction will revert
    /// @return amountA Amount of token A returned
    /// @return amountB Amount of token B returned
    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        IERC20 _tokenAContract = tokenA;
        IERC20 _tokenBContract = tokenB;
        require(
            _tokenA == address(_tokenAContract) &&
                _tokenB == address(_tokenBContract),
            "Invalid tokens"
        );
        require(block.timestamp <= deadline, "Expired");

        address self = address(this);
        uint256 _totalLiquidity = totalSupply();
        uint256 balanceA = _tokenAContract.balanceOf(self);
        uint256 balanceB = _tokenBContract.balanceOf(self);

        amountA = (liquidity * balanceA) / _totalLiquidity;
        amountB = (liquidity * balanceB) / _totalLiquidity;

        require(amountA >= amountAMin, "A not min");
        require(amountB >= amountBMin, "B not min");

        _burn(msg.sender, liquidity);
        _tokenAContract.transfer(to, amountA);
        _tokenBContract.transfer(to, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    /// @notice Swaps an exact amount of input tokens for as many output tokens as possible
    /// @dev Performs constant product AMM swap logic and emits TokenSwapped
    /// @param amountIn Exact amount of tokens to swap from input token
    /// @param amountOutMin Minimum amount of output tokens expected
    /// @param path Array of token addresses (must be [tokenIn, tokenOut])
    /// @param to Recipient of output tokens
    /// @param deadline Timestamp after which the transaction will revert
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        require(block.timestamp <= deadline, "Expired");
        require(path.length == 2, "Invalid path");

        IERC20 tokenIn = IERC20(path[0]);
        IERC20 tokenOut = IERC20(path[1]);

        address self = address(this);
        uint256 reserveIn = tokenIn.balanceOf(self);
        uint256 reserveOut = tokenOut.balanceOf(self);

        uint256 amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "Output too low");

        tokenIn.transferFrom(msg.sender, self, amountIn);
        tokenOut.transfer(to, amountOut);

        emit TokenSwapped(
            msg.sender,
            address(tokenIn),
            address(tokenOut),
            amountIn,
            amountOut,
            to
        );
    }

    /// @notice Returns the price of tokenB in terms of tokenA, validating pair matches
    /// @param _tokenA Expected address of token A (must match the contract's pair)
    /// @param _tokenB Expected address of token B (must match the contract's pair)
    /// @return price Price of tokenB in terms of tokenA, multiplied by 1e18
    function getPrice(
        address _tokenA,
        address _tokenB
    ) external view returns (uint256 price) {
        require(
            _tokenA == address(tokenA) && _tokenB == address(tokenB),
            "Invalid token pair"
        );

        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));
        require(reserveA > 0 && reserveB > 0, "No liquidity");

        price = (reserveB * 1e18) / reserveA;
    }

    /// @notice Calculates output amount of tokens based on input and reserves
    /// @param amountIn Amount of input tokens
    /// @param reserveIn Current reserve of input token
    /// @param reserveOut Current reserve of output token
    /// @return amountOut Amount of output tokens calculated
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "Zero input");
        require(reserveIn > 0 && reserveOut > 0, "No liquidity");
        amountOut = (amountIn * reserveOut) / (amountIn + reserveIn);
    }

    /// @notice Utility function to calculate square root (Babylonian method)
    /// @param y Value to calculate the square root of
    /// @return z Resulting square root of y
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
