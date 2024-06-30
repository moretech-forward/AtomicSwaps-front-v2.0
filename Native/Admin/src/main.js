const setText = (text, id) => {
  const span = document.getElementById(id);
  span.classList.remove("skeleton");
  span.classList.add("badge", "badge-xl");
  span.setAttribute("data-ctc", "");
  span.setAttribute("data-ctc-content", text);
  if (/^(0x)?[0-9a-fA-F]{40}$/.test(text) || text.startsWith("0x")) {
    span.innerText = shortenAddress(text);
  } else {
    span.innerText = text;
  }
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getForwardContractAddress = () => {
  const button = document.getElementById("btn");
  if (button) {
    button.click();

    setTimeout(() => {
      contract_address = document.getElementById(
        "form-output-myAddr-0"
      ).innerHTML;
      console.log("contract address: ", contract_address);
    }, 500);
  }
};

const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

let contract_address, token_address;
let provider, signer, walletAddress;
let contract, token_contract;
contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const initApp = async () => {
  provider = new ethers.getDefaultProvider("http://127.0.0.1:8545/");
  if (!provider.getNetwork()) {
    sleep(2000);
    getForwardContractAddress();
    if (window.parent.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
    } else {
      provider = new ethers.BrowserProvider(window.parent.ethereum);
    }
  }
  signer = await provider.getSigner();
  contract = new ethers.Contract(contract_address, abi, signer);

  walletAddress = await signer.getAddress();
};

const setFormInfo = async () => {
  const network = await provider.getNetwork();

  setNetworkName(network);
  setText(network.chainId.toString(), "chain_id_text");

  const result_key = await contract.key();
  const key = result_key === "" ? "There`s no key" : result_key;
  setText(key, "key_text");

  const deadline = await contract.deadline();
  if (deadline === 0n) {
    setText("There's no deadline", "deadline_text");
  } else {
    setText(date.toDateString() + " 23:59", "deadline_text");
  }

  setText(ethers.formatEther(await contract.amount()), "amount_text");
  setText(await contract.owner(), "owner_text");
  setText("Native", "asset_text");
  setText(await contract.otherParty(), "other_party_text");
  setText(await contract.hashKey(), "hash_key_text");
};

initApp().then(async () => {
  setFormInfo();
  await checkConnection();
});

async function checkConnection() {
  try {
    // Проверка провайдера
    await provider.getNetwork();

    console.log("All connections are available");
  } catch (error) {
    console.error("Connection check failed:", error.message);
    if (
      confirm(
        "A contract or wallet is not available. Do you want to reinitialize the application?"
      )
    ) {
      await initApp();
    }
  }
}

async function setNetworkName(network) {
  const chainList = await fetch("https://chainid.network/chains.json");
  const res = await chainList.json();
  let chainData = res.find(
    (obj) => obj.chainId.toString() === network.chainId.toString()
  );
  setText(chainData.name.toString(), "network_text");
}
