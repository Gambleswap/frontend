import {
	connectWallet,
	loadTokenAccountBalance,
	GMBContractAddress,
	getCurrentWalletConnected,
	loadCoveragePerGMB,
	loadRoundNum,
    toEther,
} from "./util/interact.js";


import React from "react";
import {Link} from "react-router-dom";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			walletAddress: "",
			tokenBalance: "",
		};
	}

	setWallet(addr) {
		this.setState(state => {
			let {walletAddress, ...remaining} = state;
			remaining.walletAddress = addr;
			return remaining;
		})
	}

	setTokenBalance(addr) {
		this.setState(state => {
			let {tokenBalance, ...remaining} = state;
			remaining.tokenBalance = addr;
			return remaining;
		})
	}

	setStatus(_new) {
		this.setState(state => {
			let {status, ...remaining} = state;
			remaining.status = _new
		})
	}

	fetchData = async () => {
		if (this.state.walletAddress !== "") {
			const tokenBalance = await loadTokenAccountBalance(this.state.walletAddress, GMBContractAddress);
			this.setTokenBalance(tokenBalance);
		}
		const { address, status } = await getCurrentWalletConnected();
		this.setWallet(address);
	};

	addWalletListener() {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				if (accounts.length > 0) {
					this.setWallet(accounts[0]);
				} else {
					this.setWallet("");
					this.setStatus("🦊 Connect to Metamask using the top right button.");
				}
			});
		} else {
			this.setStatus(
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

	connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		this.setStatus(walletResponse.status);
		this.setWallet(walletResponse.address);
	};

	componentDidMount = async () => {
		this.addWalletListener();
		await this.fetchData();
		this.interval = setInterval(() => this.fetchData(), 3000);
	};

	walletStatusComponent = (addr) => {
		return (

			<nav className="sc-4cbab3e3-1 kKtmBR">

				<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv">
					<div className="sc-c4ec0fdf-0 sc-32d5f017-0 hUlRzh fOPopv">
							<div className="sc-c4ec0fdf-0 iXqCiO">
								<div className="sc-c4ec0fdf-0 dGKbaC">
									<div className="sc-40beb420-0 iPIHoo">
										<span className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 LIvgw">{
										    this.state.tokenBalance !== ""
                                                ?
                                                toEther(this.state.tokenBalance)
                                                :
                                                ""
										} $GMB</span>
									</div>
								</div>
							</div>
						{/*<div className="sc-c4ec0fdf-0 iXqCiO">*/}
						{/*	<div className="sc-c4ec0fdf-0 dGKbaC">*/}
						{/*		<div className="sc-40beb420-0 iPIHoo">*/}
						{/*			<span className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 fjJGoS">*/}
						{/*				<Link to="/swap">*/}
						{/*					<img src="https://img.icons8.com/nolan/96/replace.png" width={50}/>*/}
						{/*				</Link>*/}
						{/*			</span>*/}
						{/*		</div>*/}
						{/*	</div>*/}
						{/*</div>*/}
						{/*<div className="sc-c4ec0fdf-0 iXqCiO">*/}
						{/*	<div className="sc-c4ec0fdf-0 dGKbaC">*/}
						{/*		<div className="sc-40beb420-0 iPIHoo">*/}
						{/*		<span className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 fjJGoS">Coverage: {this.state.coveragePerGMB}*/}
						{/*		</span>*/}
						{/*		</div>*/}
						{/*	</div>*/}
						{/*</div>*/}
					</div>
				</div>

				<div height="100%" className="sc-c4ec0fdf-0 sc-32d5f017-0 jGvODc chfQFH">
					<div className="sc-c4ec0fdf-0 eFruoX" style={{"margin-right": "10px"}}>
						<div className="sc-5c939b6f-1 fhRTdy">
							<button className="sc-95d8b156-0 jjbUqY" scale="xs">
								<Link to="/gambling">
									<img src="https://img.icons8.com/nolan/96/dice.png" width={50}/>
								</Link>
							</button>
						</div>
					</div>
					<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv" style={{"margin-right": "10px"}}>
						<button className="sc-95d8b156-0 iEdSHP sc-a97aa614-0 jMtDSu" scale="sm"
								id="open-settings-dialog-button">
								<Link to="/swap">
									<img src="https://img.icons8.com/nolan/96/replace.png" width={50}/>
								</Link>
						</button>
					</div>
					<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv" style={{"margin-right": "10px"}}>
						<button className="sc-95d8b156-0 iEdSHP sc-a97aa614-0 jMtDSu" scale="sm"
								id="open-settings-dialog-button">
								<Link to="/approve">
									<img src="https://img.icons8.com/nolan/64/approve.png" width={50}/>
								</Link>
						</button>
					</div>
					<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv" style={{"margin-right": "10px"}}>
						<button className="sc-95d8b156-0 iEdSHP sc-a97aa614-0 jMtDSu" scale="sm"
								id="open-settings-dialog-button">
							<Link to="/lending">
								<img src="https://cdn4.iconfinder.com/data/icons/banking-44/64/Home-Loan-Income-Growth-512.png" width={50}/>
							</Link>
						</button>
					</div>
					<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv" style={{"margin-right": "10px"}}>
						<button className="sc-95d8b156-0 iEdSHP sc-a97aa614-0 jMtDSu" scale="sm"
								id="open-settings-dialog-button">
							<Link to="/lp">
								<img src="https://cdn4.iconfinder.com/data/icons/banking-44/64/Home-Loan-Income-Growth-512.png" width={50}/>
							</Link>
						</button>
					</div>
					<div height="100%" className="sc-c4ec0fdf-0 sc-32d5f017-0 jGvODc chfQFH">
						<div className="sc-c4ec0fdf-0 sc-32d5f017-0 sc-28c9ece7-0 dGKbaC fOPopv bJVlVi wallet">
							<div className="sc-194ed783-0 ifVMjR wallet-img">
								<svg viewBox="0 0 24 24" color="primary" width="24px" xmlns="http://www.w3.org/2000/svg"
									 className="sc-5a69fd5e-0 dwUojQ">
									<path fillRule="evenodd" clipRule="evenodd"
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
			// <div className="row">
			// 	<div className="col-md-2">{addr}</div>
			// 	<div className="col-md-1"></div>
			// 	<div className="col-md-2" >GMBToken Balance: {tokenBalance}</div>
			// 	<div className="col-md-1"></div>
			// 	<div className="col-md-2" >Round Number: {roundNum}</div>
			// 	<div className="col-md-1"></div>
			// 	<div className="col-md-2" >CoveragePerGMB: {coveragePerGMB}</div>
			// </div>
		)
	};

	render () {
		return this.state.walletAddress.length > 0 ? (
			this.walletStatusComponent(String(this.state.walletAddress).substring(0, 6) +
				"..." +
				String(this.state.walletAddress).substring(38))
		) : (
			<nav className="sc-4cbab3e3-1 kKtmBR">

				<div className="col-md-3"></div>
				<div className="col-md-3">
					<button className="btn" id="walletButton" onClick={this.connectWalletPressed}>
						<span>Connect Wallet</span>
					</button>
				</div>

				{/*<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC fOPopv">*/}
				{/*	<div className="sc-c4ec0fdf-0 sc-32d5f017-0 hUlRzh fOPopv">*/}

				{/*		<div className="sc-c4ec0fdf-0 iXqCiO">*/}
				{/*			<div className="sc-c4ec0fdf-0 dGKbaC">*/}
				{/*				<div className="sc-40beb420-0 iPIHoo">*/}
				{/*					<span*/}
				{/*						className="sc-a01cb22d-0 bWjWCf sc-40beb420-1 fjJGoS">Round Number: {this.state.roundNum}</span>*/}
				{/*				</div>*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*</div>*/}
			</nav>
		);
	}
};

export default Header;