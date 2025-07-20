#  SimpleSwap - Solidity AMM Contract with Hardhat

This repository implements a simplified Uniswap-like Automated Market Maker (AMM) smart contract using Solidity and Hardhat. It supports adding/removing liquidity and swapping between two ERC20 tokens. The contract issues LP tokens (SST) for liquidity providers.

---

## Core Contract: `SimpleSwap.sol`

A decentralized exchange for two specific ERC20 tokens. It mints LP tokens called **SimpleSwap Token (SST)**.

### @constructor `SimpleSwap(address _tokenA, address _tokenB)`
Initializes the contract with two distinct ERC20 tokens and sets LP token metadata.

#### @param _tokenA Address of token A  
#### @param _tokenB Address of token B  
#### @dev Reverts if tokens are identical. Sets name: "SimpleSwap Token", symbol: "SST".  

---

##  `addLiquidity(...)`

Adds liquidity to the pool and mints SST tokens proportionally.

#### @param _tokenA Address of token A (must match contract configuration)  
#### @param _tokenB Address of token B (must match contract configuration)  
#### @param amountADesired Desired amount of token A to add  
#### @param amountBDesired Desired amount of token B to add  
#### @param amountAMin Minimum token A (slippage protection)  
#### @param amountBMin Minimum token B (slippage protection)  
#### @param to Address to receive minted LP tokens  
#### @param deadline Transaction deadline timestamp  

#### @return amountA Actual token A added  
#### @return amountB Actual token B added  
#### @return liquidity Amount of LP tokens minted  

#### @dev  
- Requires prior approval.  
- Reverts if tokens mismatch or deadline exceeded.  
- For initial liquidity: uses geometric mean sqrt(A * B).  
- Maintains pool ratio for subsequent liquidity.  
- Reverts on slippage conditions.  

---

## `removeLiquidity(...)`

Burns LP tokens and redeems underlying token A and B.

#### @param _tokenA Address of token A (must match contract)  
#### @param _tokenB Address of token B (must match contract)  
#### @param liquidity Amount of LP tokens to burn  
#### @param amountAMin Minimum token A to receive  
#### @param amountBMin Minimum token B to receive  
#### @param to Address to receive the tokens  
#### @param deadline Deadline for transaction  

#### @return amountA Token A received  
#### @return amountB Token B received  

#### @dev  
- Calculates proportional amount based on reserves.  
- Reverts if below slippage limits or deadline passed.  
- Transfers tokens and burns SST from sender.  

---

##  `swapExactTokensForTokens(...)`

Swaps a fixed input amount for the corresponding output token.

#### @param amountIn Exact input token amount  
#### @param amountOutMin Minimum acceptable output (slippage protection)  
#### @param path Array with [inputToken, outputToken]  
#### @param to Receiver address for output token  
#### @param deadline Deadline timestamp  

#### @dev  
- Only supports 2-token direct swap (`path.length == 2`)  
- Uses constant product formula  
- Reverts if deadline or slippage fails  

---

##  `getPrice(address _tokenA, address _tokenB)`  
Returns the price of `_tokenA` in terms of `_tokenB`.

#### @param _tokenA Base token  
#### @param _tokenB Quote token  
#### @return price Scaled price (`1e18` precision)  

#### @dev  
- Reverts if tokens are not in the pool  
- Price = (reserveB * 1e18) / reserveA (or vice versa)  

---

##  `getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)`

Calculates output token amount using the constant product formula.

#### @param amountIn Input amount  
#### @param reserveIn Reserve of input token  
#### @param reserveOut Reserve of output token  
#### @return amountOut Output token amount  

#### @dev  
- Formula: `amountOut = (amountIn * reserveOut) / (amountIn + reserveIn)`  
- Reverts if reserves or input are zero  

---

##  `sqrt(uint256 y)`

Computes integer square root using the Babylonian method.

#### @param y Value to compute sqrt  
#### @return z Resulting sqrt value  

#### @dev  
- Used during initial liquidity deposit to compute LP tokens  

---

## Project Structure & Technologies

- **Solidity**: Smart contract language  
- **Hardhat**: Development, testing, deployment framework  
- **OpenZeppelin Contracts**: Secure ERC20 implementations  
- **Ethers.js**: JS library for blockchain interactions  
- **Chai & Mocha**: Test frameworks  
- **Tailwind CSS**: Frontend styling framework  

---

## Testing

All public and external functions are covered in `SimpleSwap.test.js`.

### Includes:
- Functional tests for adding/removing liquidity, swapping
- Edge case tests: zero liquidity, expired deadlines, slippage fails

### To run tests:
-bash
npx hardhat compile
npx hardhat test

## Frontend Interface

### @notice  
A basic HTML frontend is available to visually interact with the deployed `SimpleSwap` contract.  
It is styled using **Tailwind CSS** for responsiveness and uses **Ethers.js** for Web3 interactions.

### 🔗 Live Interface  
GitHub Pages Deployment:  
👉 https://mateori0s.github.io/simpleSwapFront/front_end/

## Author

Mateo Rios (@mateori0s)

---

© 2025
