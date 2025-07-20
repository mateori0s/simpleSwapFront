# Simple Swap Smart Contract

## Overview

**SimpleSwap** is a lightweight Uniswap-like automated market maker (AMM) smart contract that allows users to:

* Add liquidity to a fixed pair of ERC20 tokens
* Remove liquidity and withdraw the underlying assets
* Swap between the tokens in the pair
* Query price and calculate swap output

This repository includes:

* Secure and well-documented Solidity smart contract (`SimpleSwap.sol`)
* Frontend interface
* Test suite using Hardhat

---

## 🔐 Smart Contract: `SimpleSwap.sol`

### Contract Summary

* **AMM Model:** Constant product (x \* y = k)
* **Pair:** Fixed pair of two ERC20 tokens defined at deployment
* **LP Token:** Inherits from OpenZeppelin's `ERC20` to represent liquidity pool (LP) shares

### Constructor

```solidity
constructor(address _tokenA, address _tokenB)
```

* Initializes the token pair
* Ensures both addresses are different

### Immutable State Variables

```solidity
IERC20 public immutable tokenA;
IERC20 public immutable tokenB;
```

These hold the two tokens used by the AMM.

---

### Functions

#### `addLiquidity(...)`

```solidity
function addLiquidity(
  address _tokenA,
  address _tokenB,
  uint256 amountADesired,
  uint256 amountBDesired,
  uint256 amountAMin,
  uint256 amountBMin,
  address to,
  uint256 deadline
) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);
```

Adds liquidity to the pool, transferring tokens from sender and minting LP tokens.

**Emits:** `LiquidityAdded`

---

#### `removeLiquidity(...)`

```solidity
function removeLiquidity(
  address _tokenA,
  address _tokenB,
  uint256 liquidity,
  uint256 amountAMin,
  uint256 amountBMin,
  address to,
  uint256 deadline
) external returns (uint256 amountA, uint256 amountB);
```

Burns LP tokens, returns proportional amount of tokenA and tokenB to user.

**Emits:** `LiquidityRemoved`

---

#### `swapExactTokensForTokens(...)`

```solidity
function swapExactTokensForTokens(
  uint256 amountIn,
  uint256 amountOutMin,
  address[] calldata path,
  address to,
  uint256 deadline
) external;
```

Swaps a fixed amount of input tokens for as many output tokens as possible.

**Emits:** `TokenSwapped`

---

#### `getPrice(...)`

```solidity
function getPrice(address _tokenA, address _tokenB) external view returns (uint256 price);
```

Returns the price of `tokenB` in terms of `tokenA`.

---

#### `getAmountOut(...)`

```solidity
function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256);
```

Calculates the output tokens using the constant product formula.

---

### Events

#### `LiquidityAdded`

```solidity
event LiquidityAdded(
  address indexed provider,
  uint256 amountA,
  uint256 amountB,
  uint256 liquidity
);
```

**Parameters:**

* `provider`: Liquidity provider address
* `amountA`: Actual amount of tokenA deposited
* `amountB`: Actual amount of tokenB deposited
* `liquidity`: LP tokens minted

#### `LiquidityRemoved`

```solidity
event LiquidityRemoved(
  address indexed provider,
  uint256 amountA,
  uint256 amountB
);
```

**Parameters:**

* `provider`: Liquidity provider address
* `amountA`: TokenA returned
* `amountB`: TokenB returned

#### `TokenSwapped`

```solidity
event TokenSwapped(
  address indexed sender,
  address indexed tokenIn,
  address indexed tokenOut,
  uint256 amountIn,
  uint256 amountOut,
  address to
);
```

**Parameters:**

* `sender`: Swapper address
* `tokenIn`: Input token address
* `tokenOut`: Output token address
* `amountIn`: Tokens swapped
* `amountOut`: Tokens received
* `to`: Recipient of output tokens

---

## 🌐 Frontend

The frontend interface allows users to interact with the deployed contract.

* **Connect Wallet (MetaMask)**
* **Add Liquidity**
* **Remove Liquidity**
* **Swap Tokens**
* **Query Price**

📍 Hosted at: [https://mateori0s.github.io/simpleSwapFront/front\_end/](https://mateori0s.github.io/simpleSwapFront/front_end/)

### Tech Stack

* **HTML/CSS**: TailwindCSS
* **JavaScript**: Ethers.js
* **Build/Deploy**: GitHub Pages

---

## 🧪 Testing

The contract is tested using Hardhat.

### Sample Tests

* Deployment and initial state
* Adding liquidity (valid/invalid cases)
* Removing liquidity
* Swapping tokens
* Price calculation

Run tests with:

```bash
npx hardhat test
```

---

## 📊 Code Coverage

Using `solidity-coverage`, test coverage includes:

* All state-modifying functions
* All validations and `require` checks
* Event emissions

Generate coverage report:

```bash
npx hardhat coverage
```

---

## ✅ Audit-Readiness Notes

* ✔️ NatSpec applied to all public/external functions
* ✔️ No reentrancy, thanks to OpenZeppelin base
* ✔️ Immutable token pair to avoid spoofing
* ✔️ No use of long string literals
* ✔️ State access minimized (cached locals)
* ✔️ Custom events added for traceability

---

## 👨‍💻 Author

Mateo Rios — [@mateori0s](https://github.com/mateori0s)
