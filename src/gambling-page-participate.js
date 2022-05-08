import {
	connectWallet,
	GamblingContractAddress,
	getApprovedToken,
	getAuthorizedPairs,
	gmbApproval,
	participate,
	toEther,
	tokenApproval,
	toWei,
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
			pairAddr: "",
			authorizedPairs: [],
			currentRoundState: {},
			approvedLP: "",
			borrow: false
		};
	}

	setApprovedLP(_new) {
		this.setState(state => {
			let {authorizedPairs, ...remaining} = state;
			remaining.approvedLP = _new;
			return remaining;
		})
	}

	setPairAddr(_new) {
		this.setState(state => {
			let {pairAddr, ...remaining} = state;
			remaining.pairAddr = _new.value;
			return remaining;
		})
	}

	callSetPairAddr() {
		const _new = document.getElementById("pairAddrInput");
		console.log(this.state.pairAddr);
		this.setPairAddr(_new);
	}

	setAuthorizedPairs(_new) {
		this.setState(state => {
			let {authorizedPairs, ...remaining} = state;
			remaining.authorizedPairs = _new;
			return remaining;
		})
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

	setBorrow(_new) {
		this.setState(state => {
			let {borrow, ...remaining} = state;
			remaining.borrow = _new;
			return remaining;
		})

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

			const newAuthorizedPool = await getAuthorizedPairs();

			if (newAuthorizedPool.length !== this.state.authorizedPairs.length) {
				this.setAuthorizedPairs(await getAuthorizedPairs());

				this.fillAuthorizedPoolInput();
			}
			
			if (this.state.pairAddr && this.state.pairAddr !== "") {
				this.setApprovedLP(await getApprovedToken(this.state.walletAddress, this.state.pairAddr, GamblingContractAddress))
			}

			this.setCurrentRoundState(await getCurrentRound(this.state.walletAddress, roundNum));
		} catch (e) {

		}

	};


	componentDidMount = async () => {
		this.interval = setInterval(() => this.fetchData(), 2000);
	};

	handleParticipation = async (e) => {
		e.preventDefault();
		await participate(this.state.walletAddress, this.state.betValue, toWei(this.state.gmbAmount), this.state.pairAddr, this.state.borrow);
	};

	handleBorrow = async (e) => {
		let borrowVal = e.target.checked
		if (borrowVal === true) {
			document.getElementById('pairAddrInput').disabled = true;
		} else {
			document.getElementById('pairAddrInput').disabled = false;
		}	
		this.setBorrow(e.target.checked);
	};

	connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		this.setStatus(walletResponse.status);
		this.setWallet(walletResponse.address);
	};

	handleGMBApproval = async (e) => {
		e.preventDefault();
		await gmbApproval(this.state.walletAddress, '9999999999999999999999999999999999999999');
	};

	handleLPApproval = async (e) => {
		e.preventDefault();
		await tokenApproval(this.state.walletAddress, this.state.pairAddr, '9999999999999999999999999999999999999999', GamblingContractAddress);
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
													 className="sc-be365e-0 krVkBZ">
													{this.state.currentRoundState && this.state.currentRoundState.totalJackpotVal
														? toEther(this.state.currentRoundState.totalJackpotVal) : "N/A"}</div>
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
													 className="sc-be365e-0 krVkBZ">
													{this.state.coveragePerGMB}
												</div>
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
																 className="sc-be365e-0 krVkBZ">
																{this.state.currentRoundState &&
																this.state.currentRoundState.yourBet !== "" ? toEther(this.state.currentRoundState.yourBet) : ""}
															</div>
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
												<input className="input100" type="list" name="pairAddr" id="pairAddrInput" list="pairlist"
												value={this.state.pairAddr}
												onChange={(e) => this.callSetPairAddr()}
												placeholder="Pair Address" style={{"margin-bottom": "5px"}}/>
												<datalist name="Pair Address" id="pairlist">
												</datalist>

												<span className="focus-input100"></span>
												<span className="symbol-input100">
													<i className="fa fa-user"></i>
												</span>
											</div>
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
												{
													this.state.currentRoundState.approvedGMB <= 0 ?
													<button className="btn" type="button" value="Approve GMB" onClick={this.handleGMBApproval}>Approve GMB</button> :
													<div>
														{this.state.currentRoundState.approvedLP}
														{
															this.state.borrow === false && this.state.approvedLP !== "" && this.state.approvedLP <= 0 ?
															<button className="btn" type="button" value="Approve LP" onClick={this.handleLPApproval}>Approve LP</button>:
															<input className="btn" value="Participate" type="submit"/>
														}
													</div>
												}


												<label className="toggle" htmlFor="uniqueID">
													<span style={{"margin-right": "5px"}}>
														Borrow LP
													</span>
													<input type="checkbox" className="toggle__input"
														   id="uniqueID"
														   onChange={this.handleBorrow}
														   checked={this.state.active}
														   name="check"
													/>
													<span className="toggle-track">
														<span className="toggle-indicator">
															<span className="checkMark">
																<svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
																	<path
																		d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
																</svg>
															</span>
														</span>
													</span>
												</label>
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

