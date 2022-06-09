import { ethers, Signer } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constant.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("I detect a metamask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
    connectButton.innerHTML = "Connected";
  } else {
    console.log("I cannot see a metamask");
    connectButton.innerHTML = "Please install Metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    // provider / connector to the blockchain
    // signer / wallet
    // contract = ABI + ADDRESS
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const singer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, singer);
    try {
      const tranResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(tranResponse, provider);
      console.log("Done with funding");
    } catch (e) {
      console.log(e);
    }
  }
}

function listenForTransactionMine(tranResponse, provider) {
  console.log(`Mining ${tranResponse.hash} ...`);
  return new Promise((resolve, reject) => {
    provider.once(tranResponse.hash, (tranReceipt) => {
      console.log(`Complete with ${tranReceipt.confirmations} confirmations`);
      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);

    console.log(
      `Balance of the connected Metamaks is ${ethers.utils.formatEther(
        balance
      )}`
    );
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const singer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, singer);
    const transactionResponse = await contract.withdraw();
    await listenForTransactionMine(transactionResponse, provider);
    console.log("Withdraw successful");
  }
}
