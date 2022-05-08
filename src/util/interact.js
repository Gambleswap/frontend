import {Route, Fetcher, Trade, TokenAmount, Pair, Percent, TradeType, Pool, Lender} from "@gambleswap/sdk";
import { toast } from 'react-toastify';

// const { Fetcher } = require('@uniswap/sdk');
var ethers = require('ethers');
require("dotenv").config();
const Web3 = require("web3");

var url = "http://127.0.0.1:8545";
var provider = new ethers.providers.JsonRpcProvider(url);
// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const GMBContractABI = require("../abis/GMBToken-abi.json");
export const GMBContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const GamblingContractABI = require("../abis/Gambling-abi.json");
export const GamblingContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const GambleswapRouterABI = require("../abis/GambleswapRouter-abi.json");
export const GambleswapRouterAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

const GambleswapLPLendingABI = require("../abis/GambleswapLPLending-abi");
export const GambleswapLPLendingAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const ERC20ABI = require("../abis/ERC20-abi.json");

const chainId = 31337;

export const getLendingPools = async (address) => {
	const len = await Fetcher.fetchPoolsLength(chainId, provider);
	let pools = [];
	for (let i = 1; i <= len; i++) {
		let pool = await Fetcher.fetchPoolData(i, chainId, provider);
		let lender;
		try {
			lender = await pool.getLenderData(address);
		}
		catch (e) {
			// console.log(e);
			lender = undefined
		}
		pool.lender = lender;
		pools.push(pool);
	}
	return pools
};

export const validateAddress = (address) => {
	try {
		ethers.utils.getAddress(address);
		return true
	} catch (e) {
		return false
	}
};

export const getAmount = async (token0, token1, type, value, slippage) => {
	var BN = web3.utils.BN;
	const slippageTolerance = new Percent(`${slippage*100}`, "10000"); // 50 bips, or 0.50%
	const RAD = await Fetcher.fetchTokenData(chainId, token0, provider);
	const DNI = await Fetcher.fetchTokenData(chainId, token1, provider);
	const pair = await Fetcher.fetchPairData(RAD, DNI, provider);
	let route = new Route([pair], RAD, DNI);
	let trade =
		type === TradeType.EXACT_INPUT ? new Trade(route, new TokenAmount(RAD, value), type, slippageTolerance)
			:
			new Trade(route, new TokenAmount(DNI, value), type, slippageTolerance);
	const res = type === TradeType.EXACT_INPUT ? trade.minimumAmountOut(slippageTolerance).raw : trade.maximumAmountIn(slippageTolerance).raw
	return res
};

export const getPair = async (token0, token1) => {
	try {
		const RAD = await Fetcher.fetchTokenData(chainId, token0, provider);
		const DNI = await Fetcher.fetchTokenData(chainId, token1, provider);
		const pair = await Fetcher.fetchPairData(RAD, DNI, provider);
		return pair
	}
	catch (e) {
		console.log(e);
		return undefined
	}
};

export const addLiquidity = async (token0, token1, amount0, amount1, amount0min, amount1min, fromAddress) => {
	const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	console.log("finaly");
	console.log(token0);
	console.log(token1);
	console.log(amount0);
	console.log(amount1);
	console.log(amount0min);
	console.log(amount1min);

	const transactionParameters = {
		to: GambleswapRouterAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GambleswapRouterContract.methods.addLiquidity(`${token0}`, `${token1}`, amount0, amount1, amount0min, amount1min, fromAddress, deadline).encodeABI(),
	};

	await signTrx(transactionParameters)
}

export const uniswapRoute = async (fromAddress, token0, token1, to, amount, type, slippage) => {

	// note that you may want/need to handle this async code differently,
	// for example if top-level await is not an option
	const RAD = await Fetcher.fetchTokenData(chainId, token0, provider);
	const DNI = await Fetcher.fetchTokenData(chainId, token1, provider);
	const pair = await Fetcher.fetchPairData(RAD, DNI, provider);
	const route = new Route([pair], RAD);

	// const trade = new Trade(
	// 	route,
	// 	new TokenAmount(RAD, "1000000000000000000"),
	// 	type
	// );
	// console.log(trade.executionPrice.toSignificant(6));
	// console.log(trade.nextMidPrice.toSignificant(6));
	let allPairs = [];
	for (var addr1 of Object.keys(Pair.cache)) {
		for (var addr2 of Object.keys(Pair.cache[addr1])) {
			allPairs.push(await Fetcher.fetchPairData(
				await Fetcher.fetchTokenData(chainId, addr1, provider),
				await Fetcher.fetchTokenData(chainId, addr2, provider),
				provider, Pair.cache[addr1][addr2]
				)
			)
		}
	}
	let ta = new TokenAmount(RAD, amount);
	let trade = type === TradeType.EXACT_INPUT ?
		Trade.bestTradeExactIn(
		allPairs,
		ta,
		DNI
	) : Trade.bestTradeExactOut(
			allPairs,
			DNI,
			ta
		);


	const slippageTolerance = new Percent(`${slippage*100}`, "10000"); // 50 bips, or 0.50%
	let path = [];
	for (let i=0; i < trade[0].route.path.length; i++){
		path.push(trade[0].route.path[i].address)
	}

	const amountOutMin = trade[0].minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
	const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
	type === TradeType.EXACT_INPUT ?
	await swapExactTokensForTokens(fromAddress, amount, amountOutMin, path, to, deadline) : swapTokensForExactTokens(fromAddress, amount, amountOutMin, path, to, deadline)

	// const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex

	// console.log(pair.token0Price)
	// const route = new Route([pair], token0);

	// console.log(route.midPrice.toSignificant(6)); // 201.306
	// console.log(route.midPrice.invert().toSignificant(6)); // 0.00496756
};

export const GMBTokenContract = new web3.eth.Contract(
	GMBContractABI,
	GMBContractAddress
);

export const GamblingContract = new web3.eth.Contract(
	GamblingContractABI,
	GamblingContractAddress
);

export const GambleswapRouterContract = new web3.eth.Contract(
	GambleswapRouterABI,
	GambleswapRouterAddress
);

export const GambleswapLPLendingContract = new web3.eth.Contract(
	GambleswapLPLendingABI,
	GambleswapLPLendingAddress
);

export const swapExactTokensForTokens = async (fromAddress, amount, amountOutMin, path, to, deadline) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const transactionParameters = {
		to: GambleswapRouterAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GambleswapRouterContract.methods.swapExactTokensForTokens(`${amount}`, `${amountOutMin}`, path, to, deadline).encodeABI(),
	};

	await signTrx(transactionParameters)
};

export const swapTokensForExactTokens = async (fromAddress, amount, amountOutMin, path, to, deadline) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const transactionParameters = {
		to: GambleswapRouterAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GambleswapRouterContract.methods.swapTokensForExactTokens(`${amount}`, `${amountOutMin}`, path, to, deadline).encodeABI(),
	};

	await signTrx(transactionParameters)
};

export const loadCoveragePerGMB = async () => {
	return await GamblingContract.methods.getCurrentRoundCoveragePerGMB().call();
};

export const loadRoundNum = async () => {
	return await GamblingContract.methods.getCurrentRound().call();
};

export const loadLPTokenAccountBalance = async (account, token0, token1) => {
	const RAD = await Fetcher.fetchTokenData(chainId, token0, provider);
	const DNI = await Fetcher.fetchTokenData(chainId, token1, provider);
	const pair = await Fetcher.fetchPairData(RAD, DNI, provider);
	const contract = new web3.eth.Contract(
		GMBContractABI,
		pair.liquidityToken.address
	);
	return await contract.methods.balanceOf(account).call();
};

export const removeLiquidity = async (account, token0, token1, liquidity) => {
	//input error handling
	if (!window.ethereum || account === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	let now = new Date();

	// tomorrow date
	let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);

	const transactionParameters = {
		to: GambleswapRouterAddress, // Required except during contract publications.
		from: account, // must match user's active address.
		data: GambleswapRouterContract.methods.removeLiquidity(`${token0}`, `${token1}`, `${liquidity}`, 0, 0, account, `${tomorrow.valueOf()/1000}`).encodeABI(),
	};

	await signTrx(transactionParameters)
};

export const loadTokenAccountBalance = async (account, contractAddress) => {
	const contract = new web3.eth.Contract(
		GMBContractABI,
		contractAddress
	);
	const balance = await contract.methods.balanceOf(account).call();
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
					status: "👆🏽 input the transfer to address in the text-field above.",
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

export const toEther = (amount) => {
	return parseFloat(ethers.utils.formatEther(amount)).toPrecision(5)
};

export const toWei = (amount) => {
	return ethers.utils.parseEther(amount).toString()
};

export const participate = async (fromAddress, betValue, gmbToken, borrow) => {
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
		data: GamblingContract.methods.participate(gmbToken, betValue, borrow).encodeABI(),
	};
	
	await signTrx(transactionParameters)

};

export const exitPool = async (fromAddress, poolIndex) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const transactionParameters = {
		to: GambleswapLPLendingAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GambleswapLPLendingContract.methods.exitLendingPool(poolIndex).encodeABI(),
	};

	await signTrx(transactionParameters);
};
export const enterPool = async (fromAddress, poolIndex, amount) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const transactionParameters = {
		to: GambleswapLPLendingAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GambleswapLPLendingContract.methods.lend(poolIndex, amount).encodeABI(),
	};

	await signTrx(transactionParameters);
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

	await signTrx(transactionParameters);
};

const signTrx = async (params) => {
	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [params],
		});
		toast.success("transaction sent to the network successfully");
		return {
			status: (
				txHash
			),
		};
	} catch (error) {
		if (error.message.includes("outputs from RPC")) {
			let errorMsg = error.message.split("outputs from RPC ")[1];
			console.log(errorMsg.slice(1, -1))
			let errorObj = JSON.parse(errorMsg.slice(1, -1));
			toast.error(errorObj.value.data.message);
		}
		else
			toast.error(error.message);
		return {
			status: error.message,
		};
	}
}

export const getGamesHistory = async (fromAddress, roundNum) => {
	var history = new Array(roundNum);
	for(let i = 1; i < roundNum; i++) {
		let data = {};
		let gameHistory = await GamblingContract.methods.getUserGameHistory(fromAddress, i).call();
		data['roundNumber'] = i;
		data['claimed'] = gameHistory.claimed;
		data['isWon'] =  gameHistory.isWon;
		data['totalJackpotVal'] = gameHistory.jackpotValue;
		data['amount'] = gameHistory.prize;
		data['yourNumber'] = gameHistory.userBetValue;
		data['yourBet'] = gameHistory.userGMB;
		data['finalNumber'] = gameHistory.finalNumber;
		data['numberOfWinners'] = gameHistory.winnerNum;
		history[i-1] = data;
	}
	return history;
};

export const getCurrentRound = async (fromAddress, roundNum) => {
	let data = {};
	let gameHistory = await GamblingContract.methods.getUserGameHistory(fromAddress, roundNum).call();
	data['participated'] = await GamblingContract.methods.participated(roundNum, fromAddress).call();
	data['totalJackpotVal'] = gameHistory.jackpotValue;
	data['yourNumber'] = gameHistory.userBetValue;
	data['yourBet'] = gameHistory.userGMB;
	return data
};

export const getApprovedGMB = async (fromAddress) => {
	return await GMBTokenContract.methods.allowance(fromAddress, GamblingContractAddress).call();
};

export const getApprovedLP = async (fromAddress, pairAddr) => {
	const contract = new web3.eth.Contract(
		ERC20ABI,
		pairAddr
	);
	return await contract.methods.allowance(fromAddress, GamblingContractAddress).call();
};

export const getApproval = async (token, owner, address) => {
	const contract = new web3.eth.Contract(
		ERC20ABI,
		token
	);
	return await contract.methods.allowance(owner, address).call();
};

export const getAuthorizedPairs = async () => {
	let poolLength = await GMBTokenContract.methods.getAuthorisedPoolsLength().call();
	let poolAddrs = []
	for (let i = 0; i < poolLength; i++) {
		let poolAddr = await GMBTokenContract.methods.authorisedPools(i).call();
		poolAddrs.push(poolAddr)
	}
	return poolAddrs;
};

export const gmbApproval = async (fromAddress, gmbToken) => {
	//input error handling
	if (!window.ethereum || fromAddress === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	if (gmbToken.trim() === "") {
		return {
			status: "❌ Your message cannot be an empty string.",
		};
	}

	const transactionParameters = {
		to: GMBContractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: GMBTokenContract.methods.approve(GamblingContractAddress, gmbToken).encodeABI(),
	};

	await signTrx(transactionParameters)

};

export const approveToken = async (token, owner, address) => {
	//input error handling
	if (!window.ethereum) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	const contract = new web3.eth.Contract(
		ERC20ABI,
		token
	);

	const transactionParameters = {
		to: token, // Required except during contract publications.
		from: owner, // must match user's active address.
		data: contract.methods.approve(address, "99999999999999999999999999999999999999999999999999").encodeABI(),
	};

	await signTrx(transactionParameters)

};

export const lpApproval = async (fromAddress, pairAddr, lpToken) => {
	//input error handling
	if (!window.ethereum || fromAddress === null || pairAddr === null) {
		return {
			status:
				"💡 Connect your Metamask wallet to update the message on the blockchain.",
		};
	}

	if (lpToken.trim() === "") {
		return {
			status: "❌ Your message cannot be an empty string.",
		};
	}

	const contract = new web3.eth.Contract(
		ERC20ABI,
		pairAddr
	);

	const transactionParameters = {
		to: pairAddr, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: contract.methods.approve(GamblingContractAddress, lpToken).encodeABI(),
	};

	await signTrx(transactionParameters)

};

