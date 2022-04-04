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
	claimPrize,
} from "./util/interact.js";

import { useState, createContext, useContext, useEffect } from "react";

const UserContext = createContext();


const Header = () => {
	//state variables
	const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");
	const [betValue, setBetValue] = useState("");
	const [GMBToken, setGMBToken] = useState("");
	const [gameNumber, setGameNumber] = useState("");

	const [tokenName, setTokenName] = useState("No connection to the network."); //default tokenName
	const [tokenBalance, setTokenBalance] = useState(
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
				setTokenBalance(tokenBalance);
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
		const res = await claimPrize(walletAddress, gameNumber);
		setStatus(res.status);
	}

	const connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	};

	const walletStatusComponent = (addr) => {
		return (

			<nav className="sc-4cbab3e3-1 kKtmBR">

				<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv">
					<div className="sc-c4ec0fdf-0 sc-32d5f017-0 hUlRzh fOPopv">
						<div className="sc-c4ec0fdf-0 iXqCiO">
							<div className="sc-c4ec0fdf-0 dGKbaC">
								<div className="sc-40beb420-0 iPIHoo">
									<span className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 LIvgw">{tokenBalance} $GMB</span>
								</div>
							</div>
						</div>
						<div className="sc-c4ec0fdf-0 iXqCiO">
							<div className="sc-c4ec0fdf-0 dGKbaC">
								<div className="sc-40beb420-0 iPIHoo">
									<span className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 fjJGoS">Round Number: {roundNum}</span>
								</div>
							</div>
						</div>
						<div className="sc-c4ec0fdf-0 iXqCiO">
							<div className="sc-c4ec0fdf-0 dGKbaC">
								<div className="sc-40beb420-0 iPIHoo">
								<span className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 fjJGoS">Coverage: {coveragePerGMB}
								</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div height="100%" className="sc-c4ec0fdf-0 sc-32d5f017-0 jGvODc chfQFH">
					<div height="100%" className="sc-c4ec0fdf-0 sc-32d5f017-0 jGvODc chfQFH">
						<div className="sc-c4ec0fdf-0 sc-32d5f017-0 sc-28c9ece7-0 dGKbaC fOPopv bJVlVi wallet">
							<div className="sc-194ed783-0 ifVMjR wallet-img">
								<svg viewBox="0 0 24 24" color="primary" width="24px" xmlns="http://www.w3.org/2000/svg"
									 className="sc-5a69fd5e-0 dwUojQ">
									<path fill-rule="evenodd" clip-rule="evenodd"
										  d="M17 4C18.5 4 19 4.5 19 6L19 8C20.1046 8 21 8.89543 21 10L21 17C21 19 20 20 17.999 20H6C4 20 3 19 3 17L3 7C3 5.5 4.5 4 6 4L17 4ZM5 7C5 6.44772 5.44772 6 6 6L19 6L19 8L6 8C5.44772 8 5 7.55229 5 7ZM17 16C18 16 19.001 15 19 14C18.999 13 18 12 17 12C16 12 15 13 15 14C15 15 16 16 17 16Z"></path>
								</svg>
							</div>
							<div title={addr} className="sc-28c9ece7-1 cnHvGm">
								{addr}
							</div>
						</div>
					</div>
				</div>
			</nav>
			//
			// <div class="row">
			// 	<div class="col-md-2">{addr}</div>
			// 	<div class="col-md-1"></div>
			// 	<div class="col-md-2" >GMBToken Balance: {tokenBalance}</div>
			// 	<div class="col-md-1"></div>
			// 	<div class="col-md-2" >Round Number: {roundNum}</div>
			// 	<div class="col-md-1"></div>
			// 	<div class="col-md-2" >CoveragePerGMB: {coveragePerGMB}</div>
			// </div>
		)
	};
	return walletAddress.length > 0 ? (
				walletStatusComponent(String(walletAddress).substring(0, 6) +
				"..." +
				String(walletAddress).substring(38))
			) : (
				<>
					<div class="col-md-3"></div>
					<div class="col-md-3">
						<button id="walletButton" onClick={connectWalletPressed}>
						<span>Connect Wallet</span>
						</button>
					</div>
					<div class="col-md-3"></div>
					<div class="col-md-3" >Round Number: {roundNum}</div>
				</>
			);
};

export default Header;