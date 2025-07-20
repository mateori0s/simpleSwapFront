// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title TestERC20
/// @author mateori0s
/// @notice A simple mock ERC20 token for testing purposes.
/// @dev This contract inherits from OpenZeppelin's standard ERC20 and adds a public `mint` function
///      and an initial supply minted to the deployer for ease of testing in development environments.
contract TestERC20 is ERC20 {
    /// @dev Constructor to initialize the ERC20 token with a name and symbol,
    ///      and mint an initial supply to the deployer.
    /// @param name The name of the ERC20 token.
    /// @param symbol The symbol of the ERC20 token.
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Mint an initial supply of 1,000,000 tokens (with 18 decimal places) to the contract deployer.
        // This provides the deployer with tokens to interact with other contracts in tests.
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /// @notice Mints new tokens and assigns them to a specified address.
    /// @dev This function is made public specifically for testing scenarios,
    ///      allowing test scripts to easily distribute tokens to various accounts.
    /// @param to The address to which the new tokens will be minted.
    /// @param amount The amount of tokens to mint.
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
