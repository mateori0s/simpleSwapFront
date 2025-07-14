🚀 SimpleSwap - Solidity AMM Contract with Hardhat
This repository contains a SimpleSwap smart contract implemented in Solidity, which simulates the core functionalities of a Uniswap-like Automated Market Maker (AMM). It includes logic for adding and removing liquidity, as well as swapping tokens. The project is set up with Hardhat for development, testing, and deployment.

✨ Core Functionalities: SimpleSwap.sol
The SimpleSwap.sol contract is the heart of this project, acting as a decentralized exchange for a specific pair of ERC20 tokens. It also issues its own ERC20 tokens (SST) as liquidity provider (LP) tokens.

constructor(address _tokenA, address _tokenB)

Initializes the SimpleSwap contract with the addresses of the two ERC20 tokens that will form the liquidity pool.

Sets the name ("SimpleSwap Token") and symbol ("SST") for the LP tokens that will be minted to liquidity providers.

Ensures that the provided token addresses are not identical.

addLiquidity(address _tokenA, address _tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)

Allows users to deposit a pair of tokens (Token A and Token B) into the pool to provide liquidity.

Initial Liquidity: If it's the first liquidity provision, amountADesired and amountBDesired are used directly, and LP tokens are minted based on the geometric mean (sqrt(amountA * amountB)).

Adding to Existing Pool: For subsequent liquidity additions, the amounts are adjusted to maintain the current pool's token ratio, minimizing slippage for the liquidity provider.

Requires prior approval for the SimpleSwap contract to spend the desired token amounts from the sender.

Includes amountAMin and amountBMin parameters for slippage protection.

LP tokens (SST) are minted to the specified to address.

Reverts if the deadline is passed, tokens are invalid, or minimum amounts are not met.

removeLiquidity(address _tokenA, address _tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)

Enables users to withdraw their proportional share of the underlying tokens (Token A and Token B) from the pool by burning their LP tokens (SST).

The amounts of Token A and Token B returned are calculated based on the amount of LP tokens burned relative to the total liquidity.

Requires the sender to have sufficient LP tokens and to have approved the SimpleSwap contract to burn them.

Includes amountAMin and amountBMin for slippage protection on withdrawal.

Reverts if the deadline is passed, tokens are invalid, or minimum amounts are not met.

swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline)

Facilitates the exchange of an exact amount of an input token for an output token within the pool.

Currently supports direct swaps between tokenA and tokenB (the path array must have a length of 2: [tokenIn, tokenOut]).

The output amount is calculated using the constant product formula (x * y = k) based on the current pool reserves.

Requires prior approval for the SimpleSwap contract to spend the amountIn of the input token from the sender.

Includes amountOutMin for slippage protection, ensuring the user receives at least a minimum amount of the output token.

Reverts if the deadline is passed, the path is invalid, the output amount is too low, or there is no liquidity.

getPrice(address _tokenA, address _tokenB) external view returns (uint256 price)

A view function that returns the current price of one token in terms of the other, based on the current reserves in the pool.

The price is scaled by 1e18 for precision (e.g., a price of 2 * 1e18 means 1 _tokenA is worth 2 _tokenB).

Reverts if invalid token addresses are provided or if there is no liquidity in the pool.

getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256 amountOut)

An internal pure function that calculates the amount of output tokens received for a given input amount and current pool reserves.

This function implements the core AMM pricing logic: amountOut = (amountIn * reserveOut) / (amountIn + reserveIn).

Reverts if amountIn is zero or if either reserveIn or reserveOut is zero (indicating no liquidity).

sqrt(uint256 y) internal pure returns (uint256 z)

An internal pure helper function to calculate the integer square root of a number.

Primarily used in the initial addLiquidity calculation for minting LP tokens based on the geometric mean of the deposited amounts.

🧪 Testing
This project includes a comprehensive suite of unit tests to ensure the correct functionality and robustness of the SimpleSwap contract.

SimpleSwap.test.js: Contains detailed tests for all public and external functions of SimpleSwap.sol, covering:

Successful execution of functions (e.g., adding liquidity, performing swaps).

Revert conditions (e.g., expired deadlines, insufficient amounts, invalid tokens, zero liquidity).

Correct calculation of amounts and balances.

TestERC20.sol: A custom mock ERC20 token contract used in tests to simulate real ERC20 tokens. It includes a mint function for easy token distribution in test scenarios.

How to Run Tests
Ensure all dependencies are installed (see Installation).

Compile your contracts:

npx hardhat compile

Run the tests:

npx hardhat test

You will see a detailed report of passed and failed tests in your terminal.

🌐 Frontend Interface
A basic HTML frontend (index.html) is provided to visually interact with the deployed SimpleSwap contract. This interface uses Tailwind CSS for styling and Ethers.js for blockchain interaction.

How to Use the Frontend
Start a Local Hardhat Network:
Open a new terminal and run:

npx hardhat node

This will start a local blockchain network and display test accounts with their private keys.

Deploy Contracts to the Local Network:
In a separate terminal, run a deployment script (e.g., scripts/deploy.js) to deploy SimpleSwap and TestERC20 tokens to your local Hardhat network. An example scripts/deploy.js is provided in the Getting Started section above.

npx hardhat run scripts/deploy.js --network localhost

Copy the deployed addresses of SimpleSwap, Token A, and Token B from the console output.

Update script.js:
Ensure your script.js file (which should be linked in index.html) is updated with the correct contract addresses and ABIs.

// script.js (example, update with your actual ABIs and addresses)
const SIMPLE_SWAP_ADDRESS = "0xYourSimpleSwapContractAddress"; // Paste SimpleSwap address here!
const TOKEN_A_ADDRESS = "0xYourTokenAContractAddress";       // Paste Token A address here!
const TOKEN_B_ADDRESS = "0xYourTokenBContractAddress";       // Paste Token B address here!

// ABIs (you can get them from artifacts/contracts/SimpleSwap.sol/SimpleSwap.json and TestERC20.sol/TestERC20.json)
const SIMPLE_SWAP_ABI = [ /* ... your SimpleSwap ABI here ... */ ];
const ERC20_ABI = [ /* ... your TestERC20 (or generic ERC20) ABI here ... */ ];

// ... rest of your JavaScript logic ...

Open index.html:
Simply open the index.html file in your web browser. You will need a Web3 wallet extension (like MetaMask) connected to your local Hardhat network (localhost:8545 by default) to interact with the interface.

🛠️ Technologies Used
Solidity: Programming language for smart contracts.

Hardhat: Ethereum development environment.

OpenZeppelin Contracts: Library of secure and reusable smart contracts (ERC20, IERC20).

Ethers.js: JavaScript library for interacting with the Ethereum blockchain.

Chai: Assertion library for testing.

Mocha: Testing framework (integrated with Hardhat).

Tailwind CSS: Utility-first CSS framework for rapid and responsive UI development.

📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.