require("dotenv").config();
const Web3 = require("web3")

// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const GMBContractABI = require("../abis/GMBToken-abi.json");
const GMBContractAddress = "0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F";

const GamblingContractABI = require("../abis/Gambling-abi.json");
const GamblingContractAddress = "0x712516e61C8B383dF4A63CFe83d7701Bce54B03e";


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
	return await GamblingContract.methods.getCurrentRoundCoveragePerGMB().call();
};

export const loadRoundNum = async () => {
	return await GamblingContract.methods.getCurrentRound().call();
};

export const loadTokenAccountBalance = async (account) => {
	const balance = await GMBTokenContract.methods.balanceOf(account).call();
	return balance;
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

export const claimPrize = async (fromAddress, gameNumber) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const transactionParameters = {
		to: GamblingContractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GamblingContract.methods.claimPrize(gameNumber).encodeABI(),
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

export const getGamesHistory = async (roundNum) => {
	var history = new Array(roundNum);
	for(let i = 1; i < roundNum; i++) {
		let data = {};
		data['winnerShare'] = await GamblingContract.methods.getGameWinnerShare(i).call();
		let winners = await GamblingContract.methods.getGameWinners(i).call();
		data['winners'] = []
		for(let j = 0; j < winners.length; j++) {
			if (winners[j].startsWith("0x0000000000000000000000000000000000000000"))
				break;
			data['winners'].push(winners[j]);
		}
		history[i-1] = data;
	}
	console.log(history);
	return history;
};