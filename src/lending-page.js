import {GambleswapLPLendingAddress, getApproval, getCurrentWalletConnected, GMBContractAddress, loadRoundNum, loadTokenAccountBalance, toEther, tokenApproval, toWei} from "./util/interact.js";

import React from "react";
import {enterPool, exitPool, getLendingPools} from "./util/interact";


class Lending extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			walletAddress: "",
			status: "",
			pools: [],
			roundNum: "",
            amounts: {},
			approvedLP: [],
			lpTokens: [],
		};
	}

	setApprovedLP = (_new) => {
		this.setState(state => {
			let {approvedLP, ...remaining} = state;
			remaining.approvedLP = _new;
			return remaining;
		})
	};

	setLPTokens = (_new) => {
		this.setState(state => {
			let {lpTokens, ...remaining} = state;
			remaining.lpTokens = _new;
			return remaining;
		})
	};

	setAmount = (_new, index) => {
	    this.setState(state => {
	        state.amounts[index] = _new;
	        return state
        })
    };

	setRoundNum = (_new) => {
		this.setState(state => {
			let {roundNum, ...remaining} = state;
			remaining.roundNum = _new;
			return remaining;
		})
	};

	setPools(_new) {
		this.setState(state => {
			let {games, ...remaining} = state;
			remaining.pools = _new;
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

	setStatus(_new) {
		this.setState(state => {
			let {status, ...remaining} = state;
			remaining.status = _new
		})
	}

	componentDidMount = async () => {
		await this.fetchData();
		await setInterval(() => this.fetchData(), 3000);
	};

	fetchData = async () => {
		try {
			this.addWalletListener();
			const {address, status} = await getCurrentWalletConnected();
			this.setWallet(address);
			this.setStatus(status);
			this.setPools(await this.getPools());
			const roundNum = await loadRoundNum();
			this.setRoundNum(roundNum);	

			let approvedLP = []
			let lpTokens = []
			for(let i = 0; i < this.state.pools.length; i++) {
				let pairAddr = this.state.pools[i].liquidityPair.liquidityToken.address
				approvedLP.push(await getApproval(pairAddr, this.state.walletAddress, GambleswapLPLendingAddress))
				lpTokens.push(toEther(await loadTokenAccountBalance(this.state.walletAddress, pairAddr)))
			}	
			this.setApprovedLP(approvedLP)	
			this.setLPTokens(lpTokens)
		} catch (e) {
			console.log(e)
		}
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

	handleExit = async (event) => {
		let roundNumber = event.target.getAttribute('pool-index');
		const res = await exitPool(this.state.walletAddress, roundNumber);
	};

	handleEnter = async (event) => {
		let poolNumber = event.target.getAttribute('pool-index');
		const res = await enterPool(this.state.walletAddress, poolNumber, toWei(this.state.amounts[poolNumber]));
	};

	handleLPApproval = async (e) => {
		e.preventDefault();
		let poolNumber = Number(e.target.getAttribute('pool-index')) - 1;
		let pairAddr = this.state.pools[poolNumber].liquidityPair.liquidityToken.address
		await tokenApproval(this.state.walletAddress, pairAddr, '9999999999999999999999999999999999999999', GambleswapLPLendingAddress);
	};

	getPools = async () => {
		if (!this.state.walletAddress || this.state.walletAddress === "")
			return [];

		let ah = await getLendingPools(this.state.walletAddress);
		// let pool = ah[0];
		// console.log(parseFloat(pool.lender.amount.raw) * (pool.interestPerShare.raw - pool.lender.debtPerShare));
		// console.log(parseFloat(ah[0].lender.amount.raw));
        // console.log(parseInt(ah[0].interestPerShare.raw));
        // console.log(parseInt(ah[0].lender.debtPerShare));
        // console.log(parseInt(pool.lendersNum));
		// console.log(parseInt(pool.totalLiquidity.raw));
		// console.log(parseInt(pool.totalLiquidityBorrowed.raw));
		// console.log(parseInt(pool.interestPerShare.raw));
		// console.log(parseInt(pool.interestPerBorrow.raw));
		// console.log(pool.liquidityPair.liquidityToken);
		// console.log(pool.liquidityPair.tokenAmounts[0].token.name);
		// console.log(pool.liquidityPair.tokenAmounts[0].token.symbol);
		// console.log(pool.liquidityPair.tokenAmounts[1].token.name);
		// console.log(pool.liquidityPair.tokenAmounts[1].token.symbol);
        return ah
	};

	fillInPreviousGames = () => {

		return (
			this.state.pools.map(pool =>
				(
					<div key={pool.index ? pool.index.toString() : 0} className="col-md-8" style={{marginTop: "10px"}}>
						<div className="sc-c4ec0fdf-0 sc-32d5f017-0 sc-d90693fb-0 dGKbaC htheDr jfTcA-D">
							<div className="sc-c4ec0fdf-0 sc-32d5f017-0 gmOXNJ jMqaHv">
								<div className="sc-eecfaa46-0 hkCvwg sc-57476884-1 OA-dwz">
									<div className="sc-c4ec0fdf-0 sc-eecfaa46-1 dGKbaC isZJSj">
										<div height="72px" className="sc-c4ec0fdf-0 sc-b3fe3fbc-0 epLSSF gZEYEG">
											<div color="text" className="sc-be365e-0 QveLg" style={{width: "max-content"}}>
												{
													`${pool.liquidityPair.tokenAmounts[0].token.symbol} <> ${pool.liquidityPair.tokenAmounts[1].token.symbol} - Balance: ${this.state.lpTokens[pool.index-1]} $LP`
												}
											</div>
										</div>
										<div className="sc-c4ec0fdf-0 sc-57476884-0 dGKbaC gTklXV">
											<div className="sc-c4ec0fdf-0 eQkZMk">
												<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
													<div fontSize="12px" color="textSubtle"
														 className="sc-be365e-0 dmGxwu">Lenders number
													</div>
													<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
														<div color="text" className="sc-be365e-0 krVkBZ">{
															`${pool.lendersNum}`
														}</div>
													</div>
												</div>
												<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
													<div fontSize="12px" color="textSubtle"
														 className="sc-be365e-0 dmGxwu">Total Borrowed Liquidity
													</div>
													<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
														<div color="text" className="sc-be365e-0 krVkBZ">{
															`${toEther(pool.totalLiquidityBorrowed.raw.toString())} $LP`
														}</div>
													</div>
												</div>
												<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
													<div fontSize="12px" color="textSubtle"
														 className="sc-be365e-0 dmGxwu">Total Liquidity
													</div>
													<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
														<div color="text" className="sc-be365e-0 krVkBZ">{
															`${toEther(pool.totalLiquidity.raw.toString())} $LP`
														}</div>
													</div>
												</div>
												<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
													<div fontSize="12px" color="textSubtle"
														 className="sc-be365e-0 dmGxwu">Interest Per Borrow
													</div>
													<div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
														<div color="text" className="sc-be365e-0 krVkBZ">{
															`${toEther(pool.interestPerBorrow.raw.toString())} $GMB`
														}</div>
													</div>
												</div>
												{
												    pool.lender !== undefined ?
                                                        <>
                                                            <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                                <div fontSize="12px" color="textSubtle"
                                                                     className="sc-be365e-0 dmGxwu">Your Stake
                                                                </div>
                                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                                    <div color="text" className="sc-be365e-0 krVkBZ">{
                                                                        `${toEther(pool.lender.amount.raw.toString())*1e12} $LP`
                                                                    }</div>
                                                                </div>
                                                            </div>
                                                            <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                                <div fontSize="12px" color="textSubtle"
                                                                     className="sc-be365e-0 dmGxwu">Your Reward
                                                                </div>
                                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                                    <div color="text" className="sc-be365e-0 krVkBZ">{
                                                                        `${toEther(pool.lender.amount.raw.toString()) * (parseFloat(pool.interestPerShare.raw.toString()) - parseFloat(pool.lender.debtPerShare))} $GMB`
                                                                    }</div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <button className="btn" type="button" pool-index={pool.index}
                                                                                onClick={this.handleExit}>Exit Pool</button>
                                                            </div>
                                                        </>
                                                        :
                                                        <div className="wrap-input100 validate-input m-b-10"
                                                             data-validate="Amount is required" style={{display: "inline-grid"}}>
                                                            <input className="input100" type="text" name="betValue"
                                                                   value={this.state.amount}
                                                                   onChange={(e) => this.setAmount(e.target.value, pool.index)}
                                                                   placeholder="Amount"
                                                                   style={{"margin-bottom": "10px"}}
                                                            />
															{
																this.state.approvedLP[pool.index-1] > 0 ?
																<button className="btn" type="button" pool-index={pool.index}
																	onClick={this.handleEnter}>Enter Pool</button> :
																<button className="btn" type="button" pool-index={pool.index} onClick={this.handleLPApproval}>Approve LP</button>
															}
                                                        </div>
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)
			)
		)
	};

	render = () => {
		return (
			<div className="container">
				<div className="row text-center justify-content-center">
					{
						this.fillInPreviousGames()
					}
				</div>
			</div>
		)
	}
};

export default Lending;


