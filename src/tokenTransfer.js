import React from "react";
import { useEffect, useState } from "react";
import {
	GMBTokenContract,
	connectWallet,
	participate,
	loadTokenName,
	loadTokenAccountBalance,
	getCurrentWalletConnected,
	loadCoveragePerGMB,
	loadRoundNum,
	claim,
	getGamesHistory,
} from "./util/interact.js";

import Ubclogo from "./ubc-logo.png";

const TokenTransfer = () => {
	//state variables
	const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");
	const [betValue, setBetValue] = useState("");
	const [GMBToken, setGMBToken] = useState("");
	const [gameNumber, setGameNumber] = useState("");

	const [tokenName, setTokenName] = useState("No connection to the network."); //default tokenName
	const [tokenBalance, settokenBalance] = useState(
		"No connection to the network."
	);
	const [coveragePerGMB, setCoveragePerGMB] = useState(
		"No connection to the network."
	);
	const [roundNum, setRoundNum] = useState(
		"No connection to the network."
	);


	const [toAddress, setToAddress] = useState("");

	//called only once
	useEffect(() => {
		async function fetchData() {
			if (walletAddress !== "") {
				const tokenBalance = await loadTokenAccountBalance(walletAddress);
				settokenBalance(tokenBalance);
			}
			const tokenName = await loadTokenName();
			setTokenName(tokenName);
			const coveragePerGMB = await loadCoveragePerGMB();
			setCoveragePerGMB(coveragePerGMB);
			const roundNum = await loadRoundNum();
			setRoundNum(roundNum);
			const { address, status } = await getCurrentWalletConnected();
			setWallet(address);
			setStatus(status);
			addWalletListener();
		}
		fetchData();
	}, [walletAddress, tokenBalance]);

	function addWalletListener() {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				if (accounts.length > 0) {
					setWallet(accounts[0]);
				} else {
					setWallet("");
					setStatus("🦊 Connect to Metamask using the top right button.");
				}
			});
		} else {
			setStatus(
				<p>
					{" "}
					🦊{" "}
					<a target="_blank" href={`https://metamask.io/download.html`}>
						You must install Metamask, a virtual Ethereum wallet, in your
						browser.
					</a>
				</p>
			);
		}
	}

	const handleParticipation = async () => {
		setBetValue(betValue);
		setGMBToken(GMBToken);
		const res = await participate(walletAddress, betValue, GMBToken);
		setStatus(res.status);
	}

	const handleClaim = async () => {
		setBetValue(gameNumber);
		const res = await claim(walletAddress, gameNumber);
		setStatus(res.status);
	}

	const handleGamesHistory = async () => {
		const res = await getGamesHistory(roundNum);
		// for(let i = 0; i < res.length; i++) {
		// 	res[i]
		// }
	}

	const connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	};

	return (
		<div id="container">
		{walletAddress.length > 0 ? (
			"Connected: " +
			String(walletAddress).substring(0, 6) +
			"..." +
			String(walletAddress).substring(38)
		) : (
	 		<button id="walletButton" onClick={connectWalletPressed}>
			<span>Connect Wallet</span>
	 		</button>
		)}
		<h4 style={{ paddingTop: "50px" }}>GMBToken Balance: {tokenBalance}</h4>
		<h4 style={{ paddingTop: "50px" }}>Round Number: {roundNum}</h4>
		<h4 style={{ paddingTop: "50px" }}>CoveragePerGMB: {coveragePerGMB}</h4>
		<hr></hr>
		<label>Bet Value:
			<input 
			type="text" 
			value={betValue}
			onChange={(e) => setBetValue(e.target.value)}
			/>
		</label>
		<label>GMB Token:
			<input 
			type="text" 
			value={GMBToken}
			onChange={(e) => setGMBToken(e.target.value)}
			/>
		</label>
		<input type="submit" value="participate" onClick={handleParticipation}/>
		<hr></hr>
		<label>Game Number:
			<input 
			type="text" 
			value={gameNumber}
			onChange={(e) => setGameNumber(e.target.value)}
			/>
		</label>
		<input type="submit" value="claim" onClick={handleClaim}/>
		<p id="status">{status}</p>
		<hr></hr>
		<button onClick={handleGamesHistory}>Get Winners</button>

		</div>
	)
};

export default TokenTransfer;
