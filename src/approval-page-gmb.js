import {
	connectWallet,
	getApprovedGMB,
	gmbApproval,
	participate,
} from "./util/interact.js";

import React from "react";
import {getCurrentRound, loadCoveragePerGMB, loadRoundNum} from "./util/interact";

class Gambling extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			walletAddress: "",
			betValue: "",
			gmbAmount: "",
			status: "",
			coveragePerGMB: "",
			roundNum: "",
			approvedGMB: "",
			currentRoundState: {},
		};
	}

	setStatus(_new) {
		this.setState(state => {
			let {status, ...remaining} = state;
			remaining.status = _new
		})
	}

	setGMBAmount(_new) {
		this.setState(state => {
			let {gmbAmount, ...remaining} = state;
			remaining.gmbAmount = _new;
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

	setBetValue(_new) {
		this.setState(state => {
			let {betValue, ...remaining} = state;
			remaining.betValue = _new;
			return remaining;
		})
	}

	setApprovedGMB(_new) {
		this.setState(state => {
			let {approvedGMB, ...remaining} = state;
			remaining.approvedGMB = _new;
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

	fetchData = async () => {
		try {
			this.addWalletListener();
			await this.connectWalletPressed();
			this.setApprovedGMB(await getApprovedGMB(this.state.walletAddress));
		} catch (e) {

		}

	};


	componentDidMount = async () => {
		this.interval = setInterval(() => this.fetchData(), 2000);
	};

	handleParticipation = async (e) => {
		e.preventDefault();
		await participate(this.state.walletAddress, this.state.betValue, this.state.gmbAmount);
	};

	handleGMBApproval = async (e) => {
		e.preventDefault();
		await gmbApproval(this.state.walletAddress, this.state.gmbAmount);
	};


	connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		this.setStatus(walletResponse.status);
		this.setWallet(walletResponse.address);
	};

	render() {
		return (
			<div className="card participate">
				{/*<img className="card-img-top" src="..." alt="Card image cap">*/}
				<div className="card-body">
					<h5 className="card-title align-middle">GMB Token Approval</h5>
					<div className="container">
						<div className="row">
						<div className="col-md-6"></div>
							<div className="col-md-12">
								<p>Approved GMB Tokens: {this.state.approvedGMB}</p>
								<form className="login100-form validate-form" id="participation-form"
										onSubmit={this.handleGMBApproval}>
									<div className="wrap-input100 validate-input m-b-10"
											data-validate="Amount is required">
										<input className="input100" type="text" name="amount"
												value={this.state.gmbAmount}
												onChange={(e) => this.setGMBAmount(e.target.value)}
												placeholder="GMB amount"/>
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

