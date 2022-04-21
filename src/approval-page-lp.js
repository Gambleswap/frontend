import {
	connectWallet,
	getApprovedGMB,
	getApprovedLP,
	getAuthorizedPairs,
	gmbApproval,
	lpApproval,
	participate,
} from "./util/interact.js";

import React from "react";
import {getCurrentRound, loadCoveragePerGMB, loadRoundNum} from "./util/interact";

class Gambling extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			walletAddress: "",
			status: "",
			authorizedPairs: [],
			pairAddr: "",
			approvedLPTokens: "",
			approvedGMB: "",
		};
	}

	setStatus(_new) {
		this.setState(state => {
			let {status, ...remaining} = state;
			remaining.status = _new
		})
	}

	setlpAmount(_new) {
		this.setState(state => {
			let {lpAmount, ...remaining} = state;
			remaining.lpAmount = _new;
			return remaining;
		})
	}

	setAuthorizedPairs(_new) {
		this.setState(state => {
			let {authorizedPairs, ...remaining} = state;
			remaining.authorizedPairs = _new;
			return remaining;
		})
	}

	setApprovedLPTokens(_new) {
		this.setState(state => {
			let {approvedLPTokens, ...remaining} = state;
			remaining.approvedLPTokens = _new;
			return remaining;
		})
	}

	setPairAddr(_new) {
		this.setState(state => {
			let {pairAddr, ...remaining} = state;
			remaining.pairAddr = _new;

			return remaining;
		})
	}

	setWallet(_new) {
		this.setState(state => {
			let {walletAddress, ...remaining} = state;
			remaining.walletAddress = _new;
			return remaining;
		})
	}

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

	fillAuthorizedPoolInput() {
		let list = document.getElementById("pairlist");
		let childs = []
		for (let i = 0; i < this.state.authorizedPairs.length; i++) {
			let option = document.createElement('option');
			option.value = this.state.authorizedPairs[i];
			childs.push(option);	 
		}
		list.replaceChildren(...childs);
	}

	fetchData = async () => {
		try {
			this.addWalletListener();
			await this.connectWalletPressed();
			this.setAuthorizedPairs(await getAuthorizedPairs());
			this.fillAuthorizedPoolInput();
			if (this.state.pairAddr !== "")
				this.setApprovedLPTokens(await getApprovedLP(this.state.walletAddress, this.state.pairAddr))
		} catch (e) {
			console.log(e)
		}

	};

	componentDidMount = async () => {
		this.interval = setInterval(() => this.fetchData(), 2000);
	};

	connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		this.setStatus(walletResponse.status);
		this.setWallet(walletResponse.address);
	};

	handleLPApproval = async (e) => {
		e.preventDefault();
		await lpApproval(this.state.walletAddress, this.state.pairAddr, this.state.lpAmount);
	};

	render() {
		return (
			<div className="card participate">
				{/*<img className="card-img-top" src="..." alt="Card image cap">*/}
				<div className="card-body">
					<h5 className="card-title align-middle">LP Token Approval</h5>
					<div className="container">
						<div className="row">
						<div className="col-md-6"></div>
							<div className="col-md-12">
								<form className="login100-form validate-form" id="participation-form"
										onSubmit={this.handleLPApproval}>
									<div className="wrap-input100 validate-input m-b-10"
											data-validate="Amount is required">
										<p>Approved LP Tokens: {this.state.approvedLPTokens}</p>
										<input className="input100" type="list" name="pairAddr"  list="pairlist"
												value={this.state.pairAddr}
												onChange={(e) => this.setPairAddr(e.target.value)}
												placeholder="Pair Address" style={{"margin-bottom": "5px"}}/>
											<datalist name="Pair Address" id="pairlist">
											</datalist>
										<input className="input100" type="text" name="amount"
												value={this.state.lpAmount}
												onChange={(e) => this.setlpAmount(e.target.value)}
												placeholder="LP amount"/>
										<span className="focus-input100"></span>
										<span className="symbol-input100">
											<i className="fa fa-lock"></i>
										</span>
									</div>
									<div className="container-login100-form-btn p-t-10">
										<input className="btn" value="Approve" type="submit"/>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Gambling;

