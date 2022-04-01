require("dotenv").config();
const Web3 = require("web3")

// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

const ERC20ABI = require("../abis/ERC20-abi.json");

const GMBContractABI = require("../abis/GMBToken-abi.json");
export const GMBContractAddress = "0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F";

const GamblingContractABI = require("../abis/Gambling-abi.json");
export const GamblingContractAddress = "0x712516e61C8B383dF4A63CFe83d7701Bce54B03e";


export const GMBTokenContract = new web3.eth.Contract(
	GMBContractABI,
	GMBContractAddress
);

export const GamblingContract = new web3.eth.Contract(
	GamblingContractABI,
	GamblingContractAddress
);

export const loadTokenName = async () => {
	const tokenName = await GMBTokenContract.methods.name().call();
	return tokenName;
};

export const loadCoveragePerGMB = async () => {
	return await GamblingContract.methods.getCurrentRound().call();
};

export const loadRoundNum = async () => {
	return await GamblingContract.methods.getCurrentRoundCoveragePerGMB().call();
};

export const loadTokenAccountBalance = async (account) => {
	const balance = await GMBTokenContract.methods.balanceOf(account).call();
	return +balance / 10 ** 18;
};

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				status: "👆🏽 input the transfer to addresst in the text-field above.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				return {
					address: addressArray[0],
					status: "👆🏽 input the transfer to addresst in the text-field above.",
				};
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button.",
				};
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

export const participate = async (fromAddress, betValue, gmbToken) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	if (betValue.trim() === "" || gmbToken.trim() === "") {
		return {
			status: "❌ Your message cannot be an empty string.",
		};
	}

	const transactionParameters = {
		to: GamblingContractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GamblingContract.methods.participate(gmbToken, betValue).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}
};
<<<<<<< Updated upstream
=======

export const loadAllowanceAmount = async (fromAddress, contractAddress, spenderAddress) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const contract = new web3.eth.Contract(
		ERC20ABI,
		contractAddress
	);

	return await contract.methods.allowance(fromAddress, spenderAddress).call();
};

// export const transferToken = async (fromAddress, toAddress) => {
// 	let value = (10 ** 18).toFixed(0);
// 	console.log(value);
// 	//input error handling
// 	if (!window.ethereum || fromAddress === null) {
// 		return {
// 			status:
// 				"💡 Connect your Metamask wallet to update the message on the blockchain.",
// 		};
// 	}

// 	if (toAddress.trim() === "") {
// 		return {
// 			status: "❌ Your message cannot be an empty string.",
// 		};
// 	}

// 	// //set up transaction parameters
// 	const transactionParameters = {
// 		to: GMBContractAddress, // Required except during contract publications.
// 		from: fromAddress, // must match user's active address.
// 		data: GMBTokenContract.methods.transfer(toAddress, value).encodeABI(),
// 	};

// 	//sign the transaction
// 	try {
// 		const txHash = await window.ethereum.request({
// 			method: "eth_sendTransaction",
// 			params: [transactionParameters],
// 		});
// 		return {
// 			status: (
// 				<span>
// 					✅{" "}
// 					<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
// 						View the status of your transaction on Etherscan!
// 					</a>
// 					<br />
// 					ℹ️ Once the transaction is verified by the network, the token balance
// 					will be updated automatically.
// 				</span>
// 			),
// 		};
// 	} catch (error) {
// 		return {
// 			status: "😥 " + error.message,
// 		};
// 	}
// };
>>>>>>> Stashed changes
