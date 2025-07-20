
# 🌀 Simple Swap 

A minimalistic decentralized token swap protocol implemented in Solidity, featuring Uniswap-style liquidity management and a simple HTML/CSS/JavaScript front-end interface. Built for the Módulo 3 evaluation.

## 📜 Smart Contract Overview

### Contract: `SimpleSwap.sol`

The `SimpleSwap` contract allows:
- Adding and removing liquidity for a fixed pair of ERC-20 tokens.
- Swapping `tokenA` for `tokenB` and vice versa.
- Getting the exchange rate (price) between the two tokens.
- Tracking liquidity provision via LP tokens (`SST`).

### Deployed Contract (Sepolia)
- Address: [`0x4dA808C5569F2D84B51991eb1edAB6180F5a50f2`](https://sepolia.etherscan.io/address/0x4dA808C5569F2D84B51991eb1edAB6180F5a50f2)

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

The front-end is a lightweight HTML/CSS/JS app built without any framework (no React), compatible with MetaMask.

### Features
- 🔌 Wallet connection (MetaMask)
- ✅ ERC-20 token approval flow
- 🔁 Swap from token A to B and B to A
- 💹 Display real-time token prices
- 💰 Display current token balances in the pool
- 🔒 Swap button disabled until approval is successful

### Live Demo
- 🔗 [Deployed Frontend (Vercel)](https://simple-swap-front.vercel.app) *(Replace with actual link if deployed)*

### UI Flow
1. Connect your wallet.
2. Enter token addresses and amount.
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

### Coverage Report
- ✅ Coverage achieved: **≥ 50%** total (goal met)
- Covered areas:
  - Liquidity logic
  - Swap calculations
  - Fail cases (reverts on deadlines, invalid tokens)
- Testing file: `test/SimpleSwap.test.js`

### Sample Output
```
-----------------------------|----------|----------|----------|----------|----------------|
File                         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------------------|----------|----------|----------|----------|----------------|
 contracts/SimpleSwap.sol    |    75.00 |    60.00 |    71.42 |    77.27 | ...            |
-----------------------------|----------|----------|----------|----------|----------------|
All files                    |    75.00 |    60.00 |    71.42 |    77.27 |                |
```

---

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

## 📂 Folder Structure

```
simpleSwapFront/
├── contracts/
│   └── SimpleSwap.sol         # Smart contract source
├── test/
│   └── SimpleSwap.test.js     # Hardhat test suite
├── scripts/
│   └── deploy.js              # Optional deploy script
├── front/
│   ├── index.html             # UI HTML
│   ├── style.css              # Styling
│   └── script.js              # JS logic (Metamask, interaction)
├── coverage/                  # Coverage reports
└── README.md
```

---

## 🛡️ Security Considerations

- All token transfers use `.transferFrom()` and `.transfer()` with proper checks.
- Deadlines prevent stale transactions.
- Contracts revert on invalid paths or token mismatches.
- Approvals are mandatory before swap execution.
- Price oracle logic is fully on-chain and uses reserves.

---

## 🧠 Instructor Recommendations Followed

✔ Contract simplified to avoid "stack too deep"  
✔ Minimized state variable access  
✔ Improved readability with internal helper `sqrt()`  
✔ Added coverage testing with `hardhat-coverage`  
✔ Applied NatSpec on all functions, modifiers and parameters  
✔ Approved before swap enforced in UI logic

---

## 🧾 License

MIT License

---

## 👤 Author

**Mateo Ríos**  
[@mateori0s](https://github.com/mateori0s)
