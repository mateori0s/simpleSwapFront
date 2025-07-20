const contractAddress = "0x1CB28389C53F2cbE4813171cD6e510fD8785e3c2";

const contractAbi = [{ "inputs": [{ "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" }], "name": "getPrice", "outputs": [{ "internalType": "uint256", "name": "price", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenA", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenB", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)"
];

let provider, signer, contract;
let tokenAAddress, tokenBAddress;
let tokenAContract, tokenBContract;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Connected: ${address}`;

    tokenAAddress = "0xee66Dc7199FbB50210c7e000BeE1341919D7Af4C";
    tokenBAddress = "0xBC8c6479C59f0CC158Da21B7e18cF027FD0812D9";

    tokenAContract = new ethers.Contract(tokenAAddress, erc20Abi, signer);
    tokenBContract = new ethers.Contract(tokenBAddress, erc20Abi, signer);

    await updateBalances();
  } else {
    alert("MetaMask not found.");
  }
}

async function updateBalances() {
  const user = await signer.getAddress();

  const balanceA = await tokenAContract.balanceOf(contractAddress);
  const balanceB = await tokenBContract.balanceOf(contractAddress);

  document.getElementById("balanceA").innerText = ethers.formatEther(balanceA);
  document.getElementById("balanceB").innerText = ethers.formatEther(balanceB);
}

async function approveToken(selectedToken) {
  const amount = document.getElementById("swapAmount").value;
  if (!amount) return alert("Enter amount");

  const token = selectedToken === "A" ? tokenAContract : tokenBContract;
  const decimals = await token.decimals();
  const amountWei = ethers.parseUnits(amount, decimals);

  try {
    const tx = await token.approve(contractAddress, amountWei);
    alert("Loading...");
    await tx.wait();
    alert(`Approved Token ${selectedToken}`);
    document.getElementById("swapBtn").classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Approval failed");
  }
}

async function swapTokens() {
  const amount = document.getElementById("swapAmount").value;
  const fromToken = document.getElementById("fromToken").value;

  if (!amount || !fromToken) {
    return alert("Enter amount");
  }

  const amountWei = ethers.parseUnits(amount, 18);
  const deadline = Math.floor(Date.now() / 1000) + 300;

  const path = fromToken === "A" ? [tokenAAddress, tokenBAddress] : [tokenBAddress, tokenAAddress];

  try {
    const tx = await contract.swapExactTokensForTokens(
      amountWei,
      0,
      path,
      await signer.getAddress(),
      deadline
    );
    alert("Loading...");
    await tx.wait();
    alert("Swap successful");
    await updateBalances();
  } catch (err) {
    console.error(err);
    alert("Swap failed");
  }
}

async function showPrice() {
  try {
    const reserveA = await tokenAContract.balanceOf(contractAddress);
    const reserveB = await tokenBContract.balanceOf(contractAddress);

    if (reserveA == 0n || reserveB == 0n) {
      document.getElementById("priceOutput").innerText = "No liquidity";
      return;
    }

    const priceAinB = reserveB * 10n ** 18n / reserveA;
    const priceBinA = reserveA * 10n ** 18n / reserveB;

    document.getElementById("priceOutput").innerHTML = `
      <div class="text-sm text-gray-700 space-y-1">
        <p><strong>1 Token A</strong> = ${ethers.formatUnits(priceAinB, 18)} Token B</p>
        <p><strong>1 Token B</strong> = ${ethers.formatUnits(priceBinA, 18)} Token A</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("priceOutput").innerText = "Error obtaining price.";
  }
}

async function estimateSwapOutput() {
  const amount = document.getElementById("swapAmount").value;
  const fromToken = document.getElementById("fromToken").value;

  if (!amount || !fromToken) return;

  const amountIn = ethers.parseUnits(amount, 18);
  const reserves = await contract.getReserves();

  let reserveIn, reserveOut;
  if (fromToken === "A") {
    reserveIn = reserves[0];
    reserveOut = reserves[1];
  } else {
    reserveIn = reserves[1];
    reserveOut = reserves[0];
  }
}
