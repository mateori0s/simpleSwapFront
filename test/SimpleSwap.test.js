/**
 * @file SimpleSwap.test.js
 * @dev This file contains the test suite for the SimpleSwap smart contract.
 * It uses Hardhat, Chai, and Ethers.js to test the core functionalities
 * such as adding/removing liquidity and token swapping.
 */

// Import necessary libraries for testing
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

/**
 * @dev Main test suite for the SimpleSwap contract.
 * Uses a `describe` block to group related tests.
 */
describe("SimpleSwap", function () {
    // Declare variables that will be used across multiple test cases.
    // These will be initialized in the `beforeEach` hook.
    let SimpleSwap; // ContractFactory for SimpleSwap
    let simpleSwap; // Deployed SimpleSwap contract instance
    let owner;      // Signer representing the deployer/owner account
    let addr1;      // Signer representing a user account (for adding liquidity, swapping)
    let addr2;      // Another signer for potential future test cases
    let addrs;      // Array of remaining signers
    let MockTokenA; // ContractFactory for Mock ERC20 Token A (TestERC20)
    let MockTokenB; // ContractFactory for Mock ERC20 Token B (TestERC20)
    let tokenA;     // Deployed instance of Mock Token A
    let tokenB;     // Deployed instance of Mock Token B

    /**
     * @dev Helper function to send a transaction and wait for its confirmation.
     * @param {Promise} txPromise - The promise returned by a contract function call that modifies state.
     * @returns {Promise<ethers.providers.TransactionReceipt>} The transaction receipt.
     */
    const sendTx = async (txPromise) => {
        const tx = await txPromise;
        return tx.wait();
    };

    /**
     * @dev Converts a human-readable amount to Wei (18 decimal places).
     * Useful for handling token amounts in Solidity's native format.
     * @param {number | string} amount - The human-readable amount.
     * @returns {BigInt} The amount in Wei.
     */
    const toWei = (amount) => ethers.parseUnits(amount.toString(), 18);

    /**
     * @dev Converts an amount in Wei (18 decimal places) to a human-readable format.
     * @param {BigInt} amount - The amount in Wei.
     * @returns {string} The human-readable amount.
     */
    const fromWei = (amount) => ethers.formatUnits(amount.toString(), 18);

    /**
     * @dev This hook runs before each test (`it` block) in this suite.
     * It sets up a fresh environment for every test, ensuring isolation.
     */
    beforeEach(async function () {
        // 1. Get signers (accounts) from Hardhat Network
        // These accounts are provided by Hardhat for testing purposes.
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // 2. Deploy Mock ERC20 Tokens for testing
        // We use 'TestERC20' (your custom mock) to simulate real ERC20 tokens.
        // Each test gets fresh instances of these tokens.
        MockTokenA = await ethers.getContractFactory("TestERC20"); // Using TestERC20 as per previous discussion
        tokenA = await MockTokenA.deploy("Mock Token A", "MTA");
        await tokenA.waitForDeployment(); // Wait for the deployment transaction to be mined

        MockTokenB = await ethers.getContractFactory("TestERC20"); // Using TestERC20
        tokenB = await MockTokenB.deploy("Mock Token B", "MTB");
        await tokenB.waitForDeployment();

        // 3. Deploy SimpleSwap contract
        // The SimpleSwap contract is deployed with the addresses of the newly deployed mock tokens.
        SimpleSwap = await ethers.getContractFactory("SimpleSwap");
        simpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress());
        await simpleSwap.waitForDeployment();

        // 4. Mint tokens to test accounts
        // The 'owner' account receives initial tokens from TestERC20's constructor.
        // We mint additional tokens to 'addr1' for various test scenarios (e.g., adding liquidity, swapping).
        await sendTx(tokenA.mint(addr1.address, toWei(500))); // Mint 500 TokenA to addr1
        await sendTx(tokenB.mint(addr1.address, toWei(500))); // Mint 500 TokenB to addr1

        // 5. Approve SimpleSwap contract to spend tokens
        // Before any account can transfer tokens to SimpleSwap (e.g., for addLiquidity or swap),
        // they must approve the SimpleSwap contract to spend their tokens.
        const simpleSwapAddress = await simpleSwap.getAddress();
        await sendTx(tokenA.approve(simpleSwapAddress, toWei(1000000))); // Owner approves TokenA
        await sendTx(tokenB.approve(simpleSwapAddress, toWei(1000000))); // Owner approves TokenB
        await sendTx(tokenA.connect(addr1).approve(simpleSwapAddress, toWei(1000000))); // Addr1 approves TokenA
        await sendTx(tokenB.connect(addr1).approve(simpleSwapAddress, toWei(1000000))); // Addr1 approves TokenB
    });

    // --- Constructor Tests ---
    /**
     * @dev Test suite for the SimpleSwap contract's constructor.
     * Verifies correct initialization upon deployment.
     */
    describe("Constructor", function () {
        /**
         * @dev Verifies that the contract is deployed with the correct token addresses.
         * Checks the `tokenA` and `tokenB` immutable state variables.
         */
        it("should deploy with the correct token addresses", async function () {
            expect(await simpleSwap.tokenA()).to.equal(await tokenA.getAddress());
            expect(await simpleSwap.tokenB()).to.equal(await tokenB.getAddress());
        });

        /**
         * @dev Verifies that the SimpleSwap LP token has the correct ERC20 name and symbol.
         */
        it("should have the correct ERC20 name and symbol", async function () {
            expect(await simpleSwap.name()).to.equal("SimpleSwap Token");
            expect(await simpleSwap.symbol()).to.equal("SST");
        });

        /**
         * @dev Verifies that deployment reverts if identical token addresses are provided.
         * This tests the `require(_tokenA != _tokenB, "Identical tokens");` condition.
         */
        it("should revert if tokens are identical", async function () {
            await expect(SimpleSwap.deploy(await tokenA.getAddress(), await tokenA.getAddress()))
                .to.be.revertedWith("Identical tokens");
        });
    });

    // --- addLiquidity Tests ---
    /**
     * @dev Test suite for the `addLiquidity` function.
     * Covers initial liquidity provision and adding to existing pools.
     */
    describe("addLiquidity", function () {
        // Define common amounts for liquidity tests
        const initialAmountA = toWei(100);
        const initialAmountB = toWei(100);
        const minAmountA = toWei(99);
        const minAmountB = toWei(99);

        /**
         * @dev Tests adding the very first liquidity to the pool.
         * Verifies LP token minting and correct token balances in the pool.
         */
        it("should add initial liquidity and mint LP tokens", async function () {
            const deadline = (await time.latest()) + 3600; // Deadline 1 hour from current block timestamp

            // Check initial SST balance of the owner (should be 0 before adding liquidity)
            const initialOwnerSSTBalance = await simpleSwap.balanceOf(owner.address);
            expect(initialOwnerSSTBalance).to.equal(0);

            // Execute addLiquidity and expect an ERC20 Transfer event for SST tokens
            // The initial liquidity is calculated as sqrt(amountA * amountB).
            // For 100 A and 100 B, liquidity = sqrt(100 * 100) = 100.
            await expect(simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                minAmountA,
                minAmountB,
                owner.address,
                deadline
            )).to.emit(simpleSwap, "Transfer") // ERC20 Transfer event for SST tokens
                .withArgs(ethers.ZeroAddress, owner.address, initialAmountA); // From zero address (mint) to owner

            // Verify token balances in the SimpleSwap contract (the pool)
            expect(await tokenA.balanceOf(await simpleSwap.getAddress())).to.equal(initialAmountA);
            expect(await tokenB.balanceOf(await simpleSwap.getAddress())).to.equal(initialAmountB);

            // Verify total supply of SST (LP tokens) and owner's SST balance
            expect(await simpleSwap.totalSupply()).to.equal(initialAmountA); // Total liquidity minted
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(initialAmountA);
        });

        /**
         * @dev Tests adding liquidity to an already existing pool.
         * Verifies that amounts are adjusted based on the current pool ratio and LP tokens are minted proportionally.
         */
        it("should add liquidity to an existing pool and adjust amounts", async function () {
            // First, add initial liquidity to set up an existing pool.
            const deadline = (await time.latest()) + 3600;
            await sendTx(simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                minAmountA,
                minAmountB,
                owner.address,
                deadline
            ));

            // Define amounts for addr1 to add, with a disproportionate desired amount for TokenB
            // to test the optimal amount calculation logic in the contract.
            const addr1AmountADesired = toWei(50);
            const addr1AmountBDesired = toWei(75); // Desired B is higher than optimal if A is 50
            const addr1MinAmountA = toWei(49);
            const addr1MinAmountB = toWei(49);

            // Record initial pool states before addr1 adds liquidity
            const initialPoolA = await tokenA.balanceOf(await simpleSwap.getAddress()); // Should be 100
            const initialPoolB = await tokenB.balanceOf(await simpleSwap.getAddress()); // Should be 100
            const initialTotalLiquidity = await simpleSwap.totalSupply(); // Should be 100

            // Execute addLiquidity from addr1's perspective
            await expect(simpleSwap.connect(addr1).addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                addr1AmountADesired,
                addr1AmountBDesired,
                addr1MinAmountA,
                addr1MinAmountB,
                addr1.address,
                deadline
            )).to.not.be.reverted; // Expect no revert

            // Calculate expected optimal amountB:
            // amountBOptimal = (amountADesired * balanceB) / balanceA
            //                = (50 * 100) / 100 = 50
            // Since amountBOptimal (50) <= amountBDesired (75), the contract should use amountA = amountADesired (50)
            // and amountB = amountBOptimal (50) to maintain the ratio.
            const expectedAmountA = toWei(50);
            const expectedAmountB = toWei(50);

            // Calculate expected new liquidity minted for addr1:
            // liquidity = (amountA * totalLiquidity) / reserveA
            //           = (50 * 100) / 100 = 50
            const expectedLiquidity = toWei(50);

            // Verify final token balances in the SimpleSwap pool
            expect(await tokenA.balanceOf(await simpleSwap.getAddress())).to.equal(initialPoolA + expectedAmountA);
            expect(await tokenB.balanceOf(await simpleSwap.getAddress())).to.equal(initialPoolB + expectedAmountB);

            // Verify total supply of SST and addr1's SST balance
            expect(await simpleSwap.totalSupply()).to.equal(initialTotalLiquidity + expectedLiquidity);
            expect(await simpleSwap.balanceOf(addr1.address)).to.equal(expectedLiquidity);
        });

        /**
         * @dev Verifies that `addLiquidity` reverts if the `deadline` has passed.
         */
        it("should revert if deadline has passed", async function () {
            const expiredDeadline = (await time.latest()) - 1; // Set deadline to 1 second in the past

            await expect(simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                minAmountA,
                minAmountB,
                owner.address,
                expiredDeadline
            )).to.be.revertedWith("Expired");
        });

        /**
         * @dev Verifies that `addLiquidity` reverts if incorrect token addresses are provided.
         * Simulates providing a token address that is not tokenA or tokenB.
         */
        it("should revert with 'Invalid tokens' if incorrect token addresses are provided", async function () {
            const deadline = (await time.latest()) + 3600;
            // Deploy a third mock token (TokenC) to use as an invalid token.
            const MockTokenC = await ethers.getContractFactory("TestERC20"); // Using TestERC20
            const tokenC = await MockTokenC.deploy("Mock Token C", "MTC");
            await tokenC.waitForDeployment();

            await expect(simpleSwap.addLiquidity(
                await tokenC.getAddress(), // Invalid token address
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                minAmountA,
                minAmountB,
                owner.address,
                deadline
            )).to.be.revertedWith("Invalid tokens");
        });

        /**
         * @dev Verifies that `addLiquidity` reverts if the calculated `amountA` is less than `amountAMin`.
         */
        it("should revert if amountA < amountAMin", async function () {
            const deadline = (await time.latest()) + 3600;
            // First, add initial liquidity to establish a pool.
            await simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(100),
                toWei(100),
                toWei(99),
                toWei(99),
                owner.address,
                deadline
            );

            // Try to add liquidity where the optimal amount of TokenA calculated by the contract
            // would be less than the specified `amountAMin`, causing a revert.
            await expect(simpleSwap.connect(addr1).addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(10),  // Desired A
                toWei(100), // Desired B (will make optimal A very small relative to B)
                toWei(11),  // amountAMin (set higher than what would be returned for 10 A desired)
                toWei(1),
                addr1.address,
                deadline
            )).to.be.revertedWith("A not min");
        });

        /**
         * @dev Verifies that `addLiquidity` reverts if the calculated `amountB` is less than `amountBMin`.
         */
        it("should revert if amountB < amountBMin", async function () {
            const deadline = (await time.latest()) + 3600;
            // First, add initial liquidity to establish a pool.
            await simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(100),
                toWei(100),
                toWei(99),
                toWei(99),
                owner.address,
                deadline
            );

            // Try to add liquidity where the optimal amount of TokenB calculated by the contract
            // would be less than the specified `amountBMin`, causing a revert.
            await expect(simpleSwap.connect(addr1).addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(100), // Desired A
                toWei(10),  // Desired B
                toWei(1),
                toWei(11),  // amountBMin (set higher than what would be returned for 10 B desired)
                addr1.address,
                deadline
            )).to.be.revertedWith("B not min");
        });
    });

    // --- removeLiquidity Tests ---
    /**
     * @dev Test suite for the `removeLiquidity` function.
     * Covers successful liquidity removal and related revert conditions.
     */
    describe("removeLiquidity", function () {
        // Define common amounts for liquidity tests
        const initialAmountA = toWei(100);
        const initialAmountB = toWei(100);
        let initialLiquidity; // Will store the LP tokens minted in beforeEach

        /**
         * @dev Hook to add initial liquidity before each `removeLiquidity` test.
         * Ensures a consistent starting state with an existing liquidity pool.
         */
        beforeEach(async function () {
            const deadline = (await time.latest()) + 3600;
            // Add initial liquidity to the pool. This creates the LP tokens that will be removed.
            const tx = await simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                toWei(99),
                toWei(99),
                owner.address,
                deadline
            );
            await tx.wait(); // Wait for the transaction to be mined
            initialLiquidity = await simpleSwap.totalSupply(); // Record the total LP tokens minted
        });

        /**
         * @dev Tests successful removal of liquidity.
         * Verifies LP token burning and correct token transfers back to the user.
         */
        it("should remove liquidity and transfer tokens back", async function () {
            const deadline = (await time.latest()) + 3600;
            const liquidityToRemove = initialLiquidity; // Remove all liquidity provided by owner
            const minAmountA = toWei(99);
            const minAmountB = toWei(99);

            // Record initial token balances of owner and pool before removal
            const ownerInitialTokenA = await tokenA.balanceOf(owner.address);
            const ownerInitialTokenB = await tokenB.balanceOf(owner.address);
            const poolInitialTokenA = await tokenA.balanceOf(await simpleSwap.getAddress());
            const poolInitialTokenB = await tokenB.balanceOf(await simpleSwap.getAddress());

            // Execute removeLiquidity and expect an ERC20 Transfer event for SST (burning)
            await expect(simpleSwap.removeLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                liquidityToRemove,
                minAmountA,
                minAmountB,
                owner.address,
                deadline
            )).to.emit(simpleSwap, "Transfer") // ERC20 Transfer event for SST tokens (burning)
                .withArgs(owner.address, ethers.ZeroAddress, liquidityToRemove); // From owner to zero address (burn)

            // Verify final token balances after removal
            // Owner should receive back the initial amounts of TokenA and TokenB.
            expect(await tokenA.balanceOf(owner.address)).to.equal(ownerInitialTokenA + initialAmountA);
            expect(await tokenB.balanceOf(owner.address)).to.equal(ownerInitialTokenB + initialAmountB);

            // SimpleSwap pool should have zero tokens left if all liquidity was removed.
            expect(await tokenA.balanceOf(await simpleSwap.getAddress())).to.equal(0);
            expect(await tokenB.balanceOf(await simpleSwap.getAddress())).to.equal(0);

            // Total supply of SST and owner's SST balance should be zero.
            expect(await simpleSwap.totalSupply()).to.equal(0);
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(0);
        });

        /**
         * @dev Verifies that `removeLiquidity` reverts if the `deadline` has passed.
         */
        it("should revert if deadline has passed", async function () {
            const expiredDeadline = (await time.latest()) - 1; // Set deadline to 1 second in the past

            await expect(simpleSwap.removeLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(10), // Some liquidity to remove
                toWei(1),
                toWei(1),
                owner.address,
                expiredDeadline
            )).to.be.revertedWith("Expired");
        });

        /**
         * @dev Verifies that `removeLiquidity` reverts if incorrect token addresses are provided.
         */
        it("should revert with 'Invalid tokens' if incorrect token addresses are provided", async function () {
            const deadline = (await time.latest()) + 3600;
            // Deploy a third mock token (TokenC) to use as an invalid token.
            const MockTokenC = await ethers.getContractFactory("TestERC20"); // Using TestERC20
            const tokenC = await MockTokenC.deploy("Mock Token C", "MTC");
            await tokenC.waitForDeployment();

            await expect(simpleSwap.removeLiquidity(
                await tokenC.getAddress(), // Invalid token address
                await tokenB.getAddress(),
                toWei(10),
                toWei(1),
                toWei(1),
                owner.address,
                deadline
            )).to.be.revertedWith("Invalid tokens");
        });

        /**
         * @dev Verifies that `removeLiquidity` reverts if the calculated `amountA` is less than `amountAMin`.
         */
        it("should revert if amountA < amountAMin", async function () {
            const deadline = (await time.latest()) + 3600;
            // Try to remove liquidity with a `minAmountA` that is higher than the expected return.
            await expect(simpleSwap.removeLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(10), // Amount of LP tokens to remove
                toWei(50), // amountAMin (set unrealistically high for the given liquidity)
                toWei(1),
                owner.address,
                deadline
            )).to.be.revertedWith("A not min");
        });

        /**
         * @dev Verifies that `removeLiquidity` reverts if the calculated `amountB` is less than `amountBMin`.
         */
        it("should revert if amountB < amountBMin", async function () {
            const deadline = (await time.latest()) + 3600;
            // Try to remove liquidity with a `minAmountB` that is higher than the expected return.
            await expect(simpleSwap.removeLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                toWei(10), // Amount of LP tokens to remove
                toWei(1),
                toWei(50), // amountBMin (set unrealistically high for the given liquidity)
                owner.address,
                deadline
            )).to.be.revertedWith("B not min");
        });
    });

    // --- getAmountOut Tests ---
    /**
     * @dev Test suite for the `getAmountOut` pure function.
     * Verifies correct output amount calculation based on input and reserves.
     */
    describe("getAmountOut", function () {
        /**
         * @dev Verifies that `getAmountOut` calculates the correct output amount using the AMM formula.
         * Formula: `amountOut = (amountIn * reserveOut) / (amountIn + reserveIn)`
         */
        it("should calculate correct amount out", async function () {
            // Example calculation: 10 TokenA in, 100 TokenA reserve, 100 TokenB reserve
            // amountOut = (10 * 100) / (10 + 100) = 1000 / 110 = 9.0909...
            expect(await simpleSwap.getAmountOut(toWei(10), toWei(100), toWei(100))).to.equal(toWei(9.090909090909090909));
        });

        /**
         * @dev Verifies that `getAmountOut` reverts if `amountIn` is zero.
         */
        it("should revert if amountIn is zero", async function () {
            await expect(simpleSwap.getAmountOut(0, toWei(100), toWei(100)))
                .to.be.revertedWith("Zero input");
        });

        /**
         * @dev Verifies that `getAmountOut` reverts if `reserveIn` is zero (no liquidity for input token).
         */
        it("should revert if reserveIn is zero", async function () {
            await expect(simpleSwap.getAmountOut(toWei(10), 0, toWei(100)))
                .to.be.revertedWith("No liquidity");
        });

        /**
         * @dev Verifies that `getAmountOut` reverts if `reserveOut` is zero (no liquidity for output token).
         */
        it("should revert if reserveOut is zero", async function () {
            await expect(simpleSwap.getAmountOut(toWei(10), toWei(100), 0))
                .to.be.revertedWith("No liquidity");
        });
    });

    // --- swapExactTokensForTokens Tests ---
    /**
     * @dev Test suite for the `swapExactTokensForTokens` function.
     * Covers token swapping functionality and related revert conditions.
     */
    describe("swapExactTokensForTokens", function () {
        // Define common amounts for swap tests
        const initialAmountA = toWei(100);
        const initialAmountB = toWei(100);

        /**
         * @dev Hook to add initial liquidity to the pool before each `swapExactTokensForTokens` test.
         * Ensures a consistent starting state with an existing liquidity pool.
         */
        beforeEach(async function () {
            const deadline = (await time.latest()) + 3600;
            // Add initial liquidity to the pool, so there are tokens to swap against.
            await sendTx(simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                toWei(99),
                toWei(99),
                owner.address,
                deadline
            ));
        });

        /**
         * @dev Tests a successful token swap.
         * Verifies correct token transfers and balance updates.
         */
        it("should swap tokens correctly", async function () {
            const deadline = (await time.latest()) + 3600;
            const amountIn = toWei(10); // Amount of TokenA to swap
            const amountOutMin = toWei(8); // Minimum expected amount of TokenB out
            const path = [await tokenA.getAddress(), await tokenB.getAddress()]; // Swap path: TokenA -> TokenB

            // Record initial balances before the swap
            const addr1InitialTokenA = await tokenA.balanceOf(addr1.address);
            const addr1InitialTokenB = await tokenB.balanceOf(addr1.address);
            const poolInitialTokenA = await tokenA.balanceOf(await simpleSwap.getAddress());
            const poolInitialTokenB = await tokenB.balanceOf(await simpleSwap.getAddress());

            // Calculate the expected output amount using the contract's own getAmountOut logic
            const expectedAmountOut = await simpleSwap.getAmountOut(
                amountIn,
                poolInitialTokenA,
                poolInitialTokenB
            );

            // Execute the swap from addr1's account
            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                addr1.address, // Recipient of the swapped tokens
                deadline
            )).to.not.be.reverted; // Expect the transaction to succeed

            // Verify final balances after the swap
            // addr1 should have less TokenA (amountIn) and more TokenB (expectedAmountOut)
            expect(await tokenA.balanceOf(addr1.address)).to.equal(addr1InitialTokenA - amountIn);
            expect(await tokenB.balanceOf(addr1.address)).to.equal(addr1InitialTokenB + expectedAmountOut);

            // The SimpleSwap pool should have more TokenA (amountIn) and less TokenB (expectedAmountOut)
            expect(await tokenA.balanceOf(await simpleSwap.getAddress())).to.equal(poolInitialTokenA + amountIn);
            expect(await tokenB.balanceOf(await simpleSwap.getAddress())).to.equal(poolInitialTokenB - expectedAmountOut);
        });

        /**
         * @dev Verifies that `swapExactTokensForTokens` reverts if the `deadline` has passed.
         */
        it("should revert if deadline has passed", async function () {
            const expiredDeadline = (await time.latest()) - 1; // Set deadline to 1 second in the past
            const amountIn = toWei(10);
            const amountOutMin = toWei(1);
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                addr1.address,
                expiredDeadline
            )).to.be.revertedWith("Expired");
        });

        /**
         * @dev Verifies that `swapExactTokensForTokens` reverts if the `path` array length is not 2.
         * The contract expects a direct swap between two tokens.
         */
        it("should revert if path length is not 2", async function () {
            const deadline = (await time.latest()) + 3600;
            const amountIn = toWei(10);
            const amountOutMin = toWei(1);
            const invalidPath = [await tokenA.getAddress()]; // Path with only one token

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                invalidPath,
                addr1.address,
                deadline
            )).to.be.revertedWith("Invalid path");
        });

        /**
         * @dev Verifies that `swapExactTokensForTokens` reverts if the calculated output amount
         * is less than `amountOutMin`.
         */
        it("should revert if amountOut is too low", async function () {
            const deadline = (await time.latest()) + 3600;
            const amountIn = toWei(10);
            const amountOutMin = toWei(100); // Set `amountOutMin` unrealistically high
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                addr1.address,
                deadline
            )).to.be.revertedWith("Output too low");
        });

        /**
         * @dev Verifies that `swapExactTokensForTokens` reverts if there's no liquidity
         * in the pool for the token pair (zero reserves).
         */
        it("should revert if no liquidity for the pair (zero reserves)", async function () {
            // Deploy a new SimpleSwap instance without adding any initial liquidity.
            const newSimpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress());
            await newSimpleSwap.waitForDeployment();
            const deadline = (await time.latest()) + 3600;
            const amountIn = toWei(10);
            const amountOutMin = toWei(1);
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];

            // Approve the new contract to spend tokens for addr1
            await sendTx(tokenA.connect(addr1).approve(await newSimpleSwap.getAddress(), toWei(1000000)));

            // Attempting a swap on an empty pool should revert with "No liquidity"
            await expect(newSimpleSwap.connect(addr1).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                addr1.address,
                deadline
            )).to.be.revertedWith("No liquidity"); // This revert comes from the internal getAmountOut call
        });
    });

    // --- getPrice Tests ---
    /**
     * @dev Test suite for the `getPrice` view function.
     * Verifies correct price calculation based on current reserves.
     */
    describe("getPrice", function () {
        // Define initial amounts for liquidity, with uneven reserves to test ratio calculation
        const initialAmountA = toWei(100);
        const initialAmountB = toWei(200);

        /**
         * @dev Hook to add initial liquidity with uneven amounts before each `getPrice` test.
         * Ensures a consistent starting state with a specific price ratio.
         */
        beforeEach(async function () {
            const deadline = (await time.latest()) + 3600;
            // Add initial liquidity to the pool with 100 TokenA and 200 TokenB.
            await sendTx(simpleSwap.addLiquidity(
                await tokenA.getAddress(),
                await tokenB.getAddress(),
                initialAmountA,
                initialAmountB,
                toWei(99),
                toWei(199),
                owner.address,
                deadline
            ));
        });

        /**
         * @dev Verifies that `getPrice` returns the correct price for TokenA in terms of TokenB.
         * Price A/B = (reserveB * 1e18) / reserveA
         * Example: (200 * 1e18) / 100 = 2 * 1e18 (meaning 1 TokenA is worth 2 TokenB)
         */
        it("should return the correct price for tokenA to tokenB", async function () {
            const expectedPrice = (initialAmountB * toWei(1)) / initialAmountA;
            expect(await simpleSwap.getPrice(await tokenA.getAddress(), await tokenB.getAddress())).to.equal(expectedPrice);
        });

        /**
         * @dev Verifies that `getPrice` returns the correct price for TokenB in terms of TokenA.
         * Price B/A = (reserveA * 1e18) / reserveB
         * Example: (100 * 1e18) / 200 = 0.5 * 1e18 (meaning 1 TokenB is worth 0.5 TokenA)
         */
        it("should return the correct price for tokenB to tokenA", async function () {
            const expectedPrice = (initialAmountA * toWei(1)) / initialAmountB;
            expect(await simpleSwap.getPrice(await tokenB.getAddress(), await tokenA.getAddress())).to.equal(expectedPrice);
        });

        /**
         * @dev Verifies that `getPrice` reverts if incorrect token addresses are provided.
         */
        it("should revert with 'Invalid tokens' if incorrect token addresses are provided", async function () {
            // Deploy a third mock token (TokenC) to use as an invalid token.
            const MockTokenC = await ethers.getContractFactory("TestERC20"); // Using TestERC20
            const tokenC = await MockTokenC.deploy("Mock Token C", "MTC");
            await tokenC.waitForDeployment();

            await expect(simpleSwap.getPrice(await tokenC.getAddress(), await tokenB.getAddress()))
                .to.be.revertedWith("Invalid tokens");
        });

        /**
         * @dev Verifies that `getPrice` reverts if there is no liquidity in the pool (zero reserves).
         */
        it("should revert with 'No liquidity' if reserves are zero", async function () {
            // Deploy a new SimpleSwap instance without adding any initial liquidity.
            const newSimpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress());
            await newSimpleSwap.waitForDeployment();

            await expect(newSimpleSwap.getPrice(await tokenA.getAddress(), await tokenB.getAddress()))
                .to.be.revertedWith("No liquidity");
        });
    });

    // --- sqrt function (internal) ---
    /**
     * @dev Note on testing internal pure functions like `sqrt`:
     * Direct testing of internal pure functions is generally not necessary if their logic
     * is thoroughly covered by the public functions that call them.
     * In this test suite, the `sqrt` function's correctness is implicitly tested
     * through the `addLiquidity` function's initial liquidity calculation.
     * If isolated testing were required, a temporary public wrapper function would be added to the contract.
     */
});
