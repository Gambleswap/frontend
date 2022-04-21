import {claimPrize, getCurrentWalletConnected, getGamesHistory, loadRoundNum, toEther, toWei} from "./util/interact.js";

import React from "react";


class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            walletAddress: "",
            status: "",
            games: [],
            roundNum: "",
        };
    }

    setRoundNum = (_new) => {
        this.setState(state => {
            let {roundNum, ...remaining} = state;
            remaining.roundNum = _new;
            return remaining;
        })
    };

    setGames(_new) {
        this.setState(state => {
            let {games, ...remaining} = state;
            remaining.games = _new;
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
        this.interval = setInterval(() => this.fetchData(), 2000);
    };

    fetchData = async () => {
        try {
            this.addWalletListener();
            const {address, status} = await getCurrentWalletConnected();
            this.setWallet(address);
            this.setStatus(status);
            this.setGames(await this.getHistory());
            const roundNum = await loadRoundNum();
            this.setRoundNum(roundNum);
        } catch (e) {

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

    handleClaim = async (event) => {
        let roundNumber = event.target.getAttribute('round-number');
        const res = await claimPrize(this.state.walletAddress, roundNumber);
    };

    getHistory = async () => {
        console.log(this.state.walletAddress);
        if (!this.state.walletAddress || this.state.walletAddress === "")
            return [];

        return await getGamesHistory(this.state.walletAddress, this.state.roundNum);
    };

    fillInPreviousGames = () => {
        return (
            this.state.games.map(game =>
                (
                    <div key={game.roundNumber ? game.roundNumber.toString() : 0} className="col-md-5" style={{marginTop: "10px"}}>
                        <div className="sc-c4ec0fdf-0 sc-32d5f017-0 sc-d90693fb-0 dGKbaC htheDr jfTcA-D">
                            <div width="100%" className="sc-c4ec0fdf-0 sc-32d5f017-0 gmOXNJ jMqaHv">
                                <div className="sc-eecfaa46-0 hkCvwg sc-57476884-1 OA-dwz">
                                    <div className="sc-c4ec0fdf-0 sc-eecfaa46-1 dGKbaC isZJSj">
                                        <div height="72px" className="sc-c4ec0fdf-0 sc-b3fe3fbc-0 epLSSF gZEYEG">
                                            <div color="text" className="sc-be365e-0 QveLg">Round #{game.roundNumber}</div>
                                        </div>
                                        <div className="sc-c4ec0fdf-0 sc-57476884-0 dGKbaC gTklXV">
                                            <div className="sc-c4ec0fdf-0 eQkZMk">
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div fontSize="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Prize
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{
                                                            game.amount !== "" && game.amount
                                                                ? toEther(game.amount) : ""
                                                        }</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div fontSize="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Total Jackpot Value
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{
                                                            game.totalJackpotVal !== "" && game.totalJackpotVal
                                                                ? toEther(game.totalJackpotVal) : ""
                                                        }</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div fontSize="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Number of Winners
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{game.numberOfWinners}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div fontSize="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Final Number
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{game.finalNumber}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div fontSize="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Your Number
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{game.yourNumber}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div fontSize="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Your Amount of Bet
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{
                                                            game.yourBet !== "" && game.yourBet
                                                                ? toEther(game.yourBet) : ""
                                                        }</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {!game.isWon ? <p>Not Won</p> : !game.claimed ?
                                                        (
                                                            <button className="btn" type="button" round-number={game.roundNumber}
                                                                    onClick={this.handleClaim}>Claim</button>
                                                        ) :
                                                            <p>Claimed</p>
                                                    }
                                                </div>
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

export default History;


