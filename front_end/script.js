// Replace with your deployed contract address and ABI
const contractAddress = "0x22f4b28966803acC4E4E509fEA95A4D8B25E7934";
const contractAbi = [ { "inputs": [ { "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "addLiquidity", "outputs": [ { "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "approver", "type": "address" } ], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" } ], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" } ], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "removeLiquidity", "outputs": [ { "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "swapExactTokensForTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" } ], "name": "getAmountOut", "outputs": [ { "internalType": "uint256", "name": "amountOut", "type": "uint256" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" } ], "name": "getPrice", "outputs": [ { "internalType": "uint256", "name": "price", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenA", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenB", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)"
];

let provider;
let signer;
let contract;
let tokenAAddress;
let tokenBAddress;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Connected: ${address}`;

    tokenAAddress = await contract.tokenA();
    tokenBAddress = await contract.tokenB();

    await updateBalances();
  } else {
    alert("MetaMask not found. Please install it.");
  }
}

async function updateBalances() {
  const address = await signer.getAddress();

  const tokenA = new ethers.Contract(tokenAAddress, erc20Abi, provider);
  const tokenB = new ethers.Contract(tokenBAddress, erc20Abi, provider);

  const balanceA = await tokenA.balanceOf(address);
  const balanceB = await tokenB.balanceOf(address);

  document.getElementById("balanceA").innerText = ethers.formatEther(balanceA);
  document.getElementById("balanceB").innerText = ethers.formatEther(balanceB);
}

async function approveToken() {
  const amountIn = document.getElementById("amountIn").value;
  const tokenIn = document.getElementById("tokenIn").value;

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const decimals = await tokenContract.decimals();
  const amountInWei = ethers.parseUnits(amountIn, decimals);

  try {
    const tx = await tokenContract.approve(contractAddress, amountInWei);
    await tx.wait();
    alert("Token approved ✅");
    document.getElementById("swapBtn").style.display = "inline-block";
  } catch (error) {
    console.error(error);
    alert(`Approve failed: ${error.message || error}`);
  }
}

async function swapTokens() {
  const amountIn = document.getElementById("amountIn").value;
  const tokenIn = document.getElementById("tokenIn").value;
  const tokenOut = document.getElementById("tokenOut").value;

  if (!amountIn || !tokenIn || !tokenOut) {
    document.getElementById("swapStatus").innerText = "Please complete all fields.";
    return;
  }

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const decimals = await tokenContract.decimals();
  const amountInWei = ethers.parseUnits(amountIn, decimals);
  const deadline = Math.floor(Date.now() / 1000) + 300; // 5 min
  const path = [tokenIn, tokenOut];

  try {
    const tx = await contract.swapExactTokensForTokens(amountInWei, 0, path, await signer.getAddress(), deadline);
    await tx.wait();
    document.getElementById("swapStatus").innerText = "Swap successful ✅";
    await updateBalances();
  } catch (error) {
    console.error(error);
    document.getElementById("swapStatus").innerText = `Swap failed: ${error.message || error}`;
  }
}

async function getPrice() {
  const tokenA = document.getElementById("priceTokenA").value;
  const tokenB = document.getElementById("priceTokenB").value;

  if (!tokenA || !tokenB) {
    document.getElementById("priceOutput").innerText = "Please enter both token addresses.";
    return;
  }

  try {
    const price = await contract.getPrice(tokenA, tokenB);
    document.getElementById("priceOutput").innerText = `Price: ${ethers.formatUnits(price, 18)}`;
  } catch (error) {
    console.error(error);
    document.getElementById("priceOutput").innerText = `Error: ${error.message || error}`;
  }
}
