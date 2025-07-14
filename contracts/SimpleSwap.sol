// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SimpleSwap Smart Contract
/// @author mateori0s
/// @notice Implements Uniswap-like add/remove liquidity and token swap logic for a fixed pair of ERC20 tokens.
/// @dev This contract acts as an Automated Market Maker (AMM) for a specific token pair (tokenA and tokenB).
///      It allows users to provide liquidity, remove liquidity, and swap between the two tokens.
///      It also mints its own ERC20 tokens (SST) as liquidity provider (LP) tokens.
contract SimpleSwap is ERC20 {
    /// @notice The address of the first ERC20 token in the pair.
    IERC20 public immutable tokenA;
    /// @notice The address of the second ERC20 token in the pair.
    IERC20 public immutable tokenB;

    /// @dev Constructor to initialize the SimpleSwap contract with the addresses of the two ERC20 tokens.
    ///      It also sets the name and symbol for the liquidity provider (LP) tokens.
    /// @param _tokenA The address of the first ERC20 token.
    /// @param _tokenB The address of the second ERC20 token.
    constructor(address _tokenA, address _tokenB)
        ERC20("SimpleSwap Token", "SST") // Initialize the LP token (SST)
    {
        require(_tokenA != _tokenB, "Identical tokens"); // Ensure tokens are not the same
        tokenA = IERC20(_tokenA); // Store tokenA address
        tokenB = IERC20(_tokenB); // Store tokenB address
    }

    /// @notice Adds liquidity to the pool, providing both tokenA and tokenB.
    /// @dev Users must approve this contract to spend `amountADesired` of tokenA and `amountBDesired` of tokenB
    ///      prior to calling this function.
    ///      If this is the first liquidity provision, `amountADesired` and `amountBDesired` are used directly.
    ///      For subsequent liquidity additions, amounts are adjusted to maintain the current pool ratio.
    ///      Liquidity Provider (LP) tokens (SST) are minted to the `to` address.
    /// @param _tokenA The address of the first token being added (must match `tokenA` in contract).
    /// @param _tokenB The address of the second token being added (must match `tokenB` in contract).
    /// @param amountADesired The desired amount of tokenA to add.
    /// @param amountBDesired The desired amount of tokenB to add.
    /// @param amountAMin The minimum amount of tokenA that must be added.
    /// @param amountBMin The minimum amount of tokenB that must be added.
    /// @param to The address to which the LP tokens will be minted.
    /// @param deadline The timestamp by which the transaction must be included.
    /// @return amountA The actual amount of tokenA added to the pool.
    /// @return amountB The actual amount of tokenB added to the pool.
    /// @return liquidity The amount of LP tokens minted.
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        // Validate token addresses
        require(
            _tokenA == address(tokenA) && _tokenB == address(tokenB),
            "Invalid tokens"
        );
        // Validate deadline
        require(block.timestamp <= deadline, "Expired");

        address self = address(this);
        uint256 totalLiquidity = totalSupply(); // Current total supply of LP tokens
        uint256 balanceA = tokenA.balanceOf(self); // Current balance of tokenA in the pool
        uint256 balanceB = tokenB.balanceOf(self); // Current balance of tokenB in the pool

        // Logic for adding liquidity to an existing pool
        if (totalLiquidity > 0) {
            // Calculate optimal amount of tokenB based on desired tokenA and current ratio
            uint256 amountBOptimal = (amountADesired * balanceB) / balanceA;
            if (amountBOptimal <= amountBDesired) {
                // If optimal B is less than or equal to desired B, use desired A and optimal B
                require(amountBOptimal >= amountBMin, "Insufficient B");
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                // Otherwise, calculate optimal amount of tokenA based on desired tokenB and current ratio
                uint256 amountAOptimal = (amountBDesired * balanceA) / balanceB;
                require(amountAOptimal >= amountAMin, "Insufficient A");
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        } else {
            // Initial liquidity provision: use desired amounts directly
            amountA = amountADesired;
            amountB = amountBDesired;
            // Calculate initial liquidity using the geometric mean (sqrt(A*B))
            liquidity = sqrt(amountA * amountB);
        }

        // Final checks against minimum amounts
        require(amountA >= amountAMin, "A not min");
        require(amountB >= amountBMin, "B not min");

        address sender = msg.sender;
        // Transfer tokens from the sender to the SimpleSwap contract
        tokenA.transferFrom(sender, self, amountA);
        tokenB.transferFrom(sender, self, amountB);

        // Calculate liquidity if not already calculated (for initial liquidity)
        liquidity = liquidity > 0 ? liquidity : sqrt(amountA * amountB);
        // Mint LP tokens to the recipient
        _mint(to, liquidity);
    }

    /// @notice Removes liquidity from the pool by burning LP tokens.
    /// @dev Users must have sufficient LP tokens (SST) and approve this contract to burn them.
    ///      Tokens (tokenA and tokenB) are returned proportionally to the amount of LP tokens burned.
    /// @param _tokenA The address of the first token (must match `tokenA` in contract).
    /// @param _tokenB The address of the second token (must match `tokenB` in contract).
    /// @param liquidity The amount of LP tokens to burn.
    /// @param amountAMin The minimum amount of tokenA to receive.
    /// @param amountBMin The minimum amount of tokenB to receive.
    /// @param to The address to which the underlying tokens (tokenA and tokenB) will be transferred.
    /// @param deadline The timestamp by which the transaction must be included.
    /// @return amountA The actual amount of tokenA received.
    /// @return amountB The actual amount of tokenB received.
    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        // Validate token addresses
        require(
            _tokenA == address(tokenA) && _tokenB == address(tokenB),
            "Invalid tokens"
        );
        // Validate deadline
        require(block.timestamp <= deadline, "Expired");

        address self = address(this);
        uint256 totalLiquidity = totalSupply(); // Current total supply of LP tokens
        uint256 balanceA = tokenA.balanceOf(self); // Current balance of tokenA in the pool
        uint256 balanceB = tokenB.balanceOf(self); // Current balance of tokenB in the pool

        // Calculate amounts of tokenA and tokenB to return based on liquidity share
        amountA = (liquidity * balanceA) / totalLiquidity;
        amountB = (liquidity * balanceB) / totalLiquidity;

        // Final checks against minimum amounts
        require(amountA >= amountAMin, "A not min");
        require(amountB >= amountBMin, "B not min");

        // Burn the LP tokens from the sender
        _burn(msg.sender, liquidity);

        // Transfer underlying tokens from the SimpleSwap contract to the recipient
        tokenA.transfer(to, amountA);
        tokenB.transfer(to, amountB);
    }

    /// @notice Swaps an exact amount of an input token for an output token.
    /// @dev This function supports direct swaps between `tokenA` and `tokenB` (path length must be 2).
    ///      Users must approve this contract to spend `amountIn` of the input token prior to calling this function.
    ///      The output amount is calculated based on the current pool reserves.
    /// @param amountIn The exact amount of the input token to swap.
    /// @param amountOutMin The minimum amount of the output token to receive (slippage protection).
    /// @param path An array of token addresses representing the swap path. Must be `[tokenIn, tokenOut]`.
    /// @param to The address to which the output tokens will be transferred.
    /// @param deadline The timestamp by which the transaction must be included.
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        // Validate deadline
        require(block.timestamp <= deadline, "Expired");
        // Validate path length (only direct swaps are supported)
        require(path.length == 2, "Invalid path");

        IERC20 tokenIn = IERC20(path[0]); // The input token from the path
        IERC20 tokenOut = IERC20(path[1]); // The output token from the path

        // Calculate the amount of output tokens based on current reserves
        uint256 amountOut = getAmountOut(
            amountIn,
            tokenIn.balanceOf(address(this)), // Reserve of input token in pool
            tokenOut.balanceOf(address(this)) // Reserve of output token in pool
        );

        // Validate that the calculated output amount meets the minimum required
        require(amountOut >= amountOutMin, "Output too low");

        // Transfer input tokens from the sender to the SimpleSwap contract
        tokenIn.transferFrom(msg.sender, address(this), amountIn);
        // Transfer output tokens from the SimpleSwap contract to the recipient
        tokenOut.transfer(to, amountOut);
    }

    /// @notice Returns the price of one token in terms of another based on current pool reserves.
    /// @dev The price is calculated as (reserve of _tokenB * 1e18) / reserve of _tokenA,
    ///      or vice-versa, scaled by 1e18 to maintain precision.
    /// @param _tokenA The address of the first token.
    /// @param _tokenB The address of the second token.
    /// @return price The price of `_tokenA` in terms of `_tokenB` (scaled by 1e18).
    function getPrice(address _tokenA, address _tokenB)
        external
        view
        returns (uint256 price)
    {
        // Validate that the provided tokens match the contract's token pair
        require(
            (_tokenA == address(tokenA) && _tokenB == address(tokenB)) ||
                (_tokenA == address(tokenB) && _tokenB == address(tokenA)),
            "Invalid tokens"
        );

        address self = address(this);
        uint256 reserveA = tokenA.balanceOf(self); // Current reserve of tokenA
        uint256 reserveB = tokenB.balanceOf(self); // Current reserve of tokenB

        // Ensure there is liquidity in the pool
        require(reserveA > 0 && reserveB > 0, "No liquidity");

        // Calculate price based on which token is _tokenA
        price = _tokenA == address(tokenA)
            ? (reserveB * 1e18) / reserveA // Price of tokenA in terms of tokenB
            : (reserveA * 1e18) / reserveB; // Price of tokenB in terms of tokenA
    }

    /// @notice Calculates the amount of output tokens received for a given input amount, based on current reserves.
    /// @dev This is a pure function, meaning it does not read or modify state.
    ///      It implements the constant product formula (x * y = k) for AMMs.
    ///      Formula: `amountOut = (amountIn * reserveOut) / (amountIn + reserveIn)`
    /// @param amountIn The amount of input tokens.
    /// @param reserveIn The current reserve of the input token in the pool.
    /// @param reserveOut The current reserve of the output token in the pool.
    /// @return amountOut The calculated amount of output tokens.
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "Zero input"); // Input amount must be greater than zero
        require(reserveIn > 0 && reserveOut > 0, "No liquidity"); // Reserves must be greater than zero
        amountOut = (amountIn * reserveOut) / (amountIn + reserveIn);
    }

    /// @dev Internal pure function to calculate the integer square root of a number.
    ///      Used for initial liquidity calculation (geometric mean).
    /// @param y The number for which to calculate the square root.
    /// @return z The integer square root of y.
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
