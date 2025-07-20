
# 🌀 SimpleSwap Protocol

A minimalistic decentralized token swap protocol implemented in Solidity, featuring Uniswap-style liquidity management and a simple HTML/CSS/JavaScript front-end interface. Built for the Módulo 3 evaluation.

## 📜 Smart Contract Overview

### Contract: `SimpleSwap.sol`

The `SimpleSwap` contract allows:
- Adding and removing liquidity for a fixed pair of ERC-20 tokens.
- Swapping `tokenA` for `tokenB` and vice versa.
- Getting the exchange rate (price) between the two tokens.
- Tracking liquidity provision via LP tokens (`SST`).

### Main Functions
- `addLiquidity(...)`: Supply both tokens to mint LP tokens.
- `removeLiquidity(...)`: Burn LP tokens to receive back the underlying tokens.
- `swapExactTokensForTokens(...)`: Perform a swap between token A and token B.
- `getPrice()`: Returns the price of token A in terms of token B (and vice versa).
- `getAmountOut(...)`: Pure function used for estimating swap output.

### NatSpec
All functions, parameters, and internal helpers are documented using NatSpec for audit clarity and automated verification.

---

## 💻 Front-End DApp

The front-end is a lightweight HTML/JS app built without any framework (no React), compatible with MetaMask.

### Features
- 🔌 Wallet connection (MetaMask)
- ✅ ERC-20 token approval flow
- 🔁 Swap from token A to B and B to A
- 💹 Display real-time token prices
- 💰 Display current token balances in the pool
- 🔒 Swap button disabled until approval is successful

### Live Demo
- 🔗 [Deployed Frontend (GitHub Pages)](https://mateori0s.github.io/simpleSwapFront/front_end/)

### UI Flow
1. Connect your wallet.
2. Enter token amount.
3. Approve selected token.
4. Swap becomes available post-approval.
5. Check token balances and price after swap.

---

## 🧪 Testing & Coverage

### Environment
This project uses [Hardhat](https://hardhat.org) for local development and testing.

```bash
npx hardhat test
npx hardhat coverage
```


## ⚙️ Installation & Local Use

### Requirements
- Node.js v16+
- Hardhat
- MetaMask (for interaction with frontend)

### Clone & Install
```bash
git clone https://github.com/mateori0s/simpleSwapFront.git
cd simpleSwapFront
npm install
```

### Run Local Node (optional)
```bash
npx hardhat node
```

### Deploy Locally (optional)
```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🧾 License

MIT License

---

## 👤 Author

**Mateo Rios**  
[@mateori0s](https://github.com/mateori0s)
