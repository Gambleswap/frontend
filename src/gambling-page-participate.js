import {
	connectWallet,
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
			currentRoundState: {},
		};
	}


	setCurrentRoundState(_new) {
		this.setState(state => {
			let {currentRoundState, ...remaining} = state;
			remaining.currentRoundState = _new;
			return remaining;
		})
	}

	setCoveragePerGMB(_new) {
		this.setState(state => {
			let {coveragePerGMB, ...remaining} = state;
			remaining.coveragePerGMB = _new;
			return remaining;
		})
	}

	setRoundNum(_new) {
		this.setState(state => {
			let {roundNum, ...remaining} = state;
			remaining.roundNum = _new;
			return remaining;
		})
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

			const coveragePerGMB = await loadCoveragePerGMB();

			this.setCoveragePerGMB(coveragePerGMB);

			const roundNum = await loadRoundNum();

			this.setRoundNum(roundNum);
			console.log(await getCurrentRound(this.state.walletAddress, roundNum));
			this.setCurrentRoundState(await getCurrentRound(this.state.walletAddress, roundNum));
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
					<h5 className="card-title align-middle">Upcoming Round</h5>
					<div className="container">
						<div className="row">
							<div className={this.state.currentRoundState.participated? "col-md-12" : "col-md-6"}>
								<div className="sc-c4ec0fdf-0 sc-57476884-0 dGKbaC gTklXV">
									<div className="sc-c4ec0fdf-0 eQkZMk">
										<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
											<div fontSize="12px" color="textSubtle"
												 className="sc-be365e-0 dmGxwu">Total Jackpot Value
											</div>
											<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH" style={{"margin-left": "10px"}}>
												<div color="text"
													 className="sc-be365e-0 krVkBZ">{this.state.currentRoundState ? this.state.currentRoundState.totalJackpotVal : "N/A"}</div>
											</div>
										</div>
										<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
											<div fontSize="12px" color="textSubtle"
												 className="sc-be365e-0 dmGxwu">Round number
											</div>
											<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH" style={{"margin-left": "10px"}}>
												<div color="text"
													 className="sc-be365e-0 krVkBZ">{this.state.roundNum}</div>
											</div>
										</div>
										<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
											<div fontSize="12px" color="textSubtle"
												 className="sc-be365e-0 dmGxwu">GMB Coverage
											</div>
											<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH" style={{"margin-left": "10px"}}>
												<div color="text"
													 className="sc-be365e-0 krVkBZ">{this.state.coveragePerGMB.slice(0, -12)}</div>
											</div>
										</div>
										{
											this.state.currentRoundState.participated ?
												<>
													<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
														<div fontSize="12px" color="textSubtle"
															 className="sc-be365e-0 dmGxwu">Your Number
														</div>
														<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
															<div color="text"
																 className="sc-be365e-0 krVkBZ">{this.state.currentRoundState.yourNumber}</div>
														</div>
													</div>
													<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
														<div fontSize="12px" color="textSubtle"
															 className="sc-be365e-0 dmGxwu">Your Bet
														</div>
														<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
															<div color="text"
																 className="sc-be365e-0 krVkBZ">{this.state.currentRoundState.yourBet}</div>
														</div>
													</div>
												</>
												: <></>
										}
									</div>
								</div>
							</div>
							{
								this.state.currentRoundState.participated ? <></> :
									<div className="col-md-5">
										<form className="login100-form validate-form" id="participation-form"
											  onSubmit={this.handleParticipation}>
											<div className="wrap-input100 validate-input m-b-10"
												 data-validate="Bet value is required">
												<input className="input100" type="text" name="betValue"
													   value={this.state.betValue}
													   onChange={(e) => this.setBetValue(e.target.value)}
													   placeholder="Bet value"/>

												<span className="focus-input100"></span>
												<span className="symbol-input100">
											<i className="fa fa-user"></i>
										</span>
											</div>
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
												<input className="btn" value="Participate" type="submit"/>
											</div>
										</form>
									</div>
							}
						</div>
					</div>
				</div>
			</div>

		)
	}
}

export default Gambling;

