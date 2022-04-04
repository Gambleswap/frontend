// import React from "react";
// import { useEffect, useState } from "react";
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


const Rewards = () => {
    //state variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [betValue, setBetValue] = useState("");
    const [GMBToken, setGMBToken] = useState("");

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
    };

    const handleClaim = async (event) => {
        let roundNumber = event.target.getAttribute('roundNumber');
        const res = await claimPrize(walletAddress, roundNumber);
        setStatus(res.status);
    };

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    const wins = [
        {
            roundNumber: 1,
            amount: 400,
            claimable: true,
            totalJackpotVal: 500000,
            numberOfWinners: 10,
            finalNumber: 30,
            yourNumber: 32,
            yourBet: 200
        },
        {
            roundNumber: 2,
            amount: 400,
            claimable: false,
            totalJackpotVal: 500000,
            numberOfWinners: 10,
            finalNumber: 30,
            yourNumber: 32,
            yourBet: 200
        },
    ]

    const fillInWins = () => {
        return (
            wins.map(win =>
                (
                    <div className="col-md-5">
                        <div className="sc-c4ec0fdf-0 sc-32d5f017-0 sc-d90693fb-0 dGKbaC htheDr jfTcA-D">
                            <div width="100%" className="sc-c4ec0fdf-0 sc-32d5f017-0 gmOXNJ jMqaHv">
                                <div className="sc-eecfaa46-0 hkCvwg sc-57476884-1 OA-dwz">
                                    <div className="sc-c4ec0fdf-0 sc-eecfaa46-1 dGKbaC isZJSj">
                                        <div height="72px" className="sc-c4ec0fdf-0 sc-b3fe3fbc-0 epLSSF gZEYEG">
                                            <div color="text" className="sc-be365e-0 QveLg">Round #{win.roundNumber}</div>
                                            {/*<button className="sc-95d8b156-0 eWVwgm sc-a97aa614-0 jMtDWj" scale="md">*/}
                                            {/*    <svg viewBox="0 0 24 24" width="24px" height="24px" color="textSubtle"*/}
                                            {/*         xmlns="http://www.w3.org/2000/svg" className="sc-5a69fd5e-0 jNuCsa">*/}
                                            {/*        <path*/}
                                            {/*            d="M8.11997 14.7101L12 10.8301L15.88 14.7101C16.27 15.1001 16.9 15.1001 17.29 14.7101C17.68 14.3201 17.68 13.6901 17.29 13.3001L12.7 8.7101C12.31 8.3201 11.68 8.3201 11.29 8.7101L6.69997 13.3001C6.30997 13.6901 6.30997 14.3201 6.69997 14.7101C7.08997 15.0901 7.72997 15.1001 8.11997 14.7101Z"></path>*/}
                                            {/*    </svg>*/}
                                            {/*</button>*/}
                                        </div>
                                        <div className="sc-c4ec0fdf-0 sc-57476884-0 dGKbaC gTklXV">
                                            <div className="sc-c4ec0fdf-0 eQkZMk">
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div font-size="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Prize
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{win.amount}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div font-size="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Total Jackpot Value
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{win.totalJackpotVal}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div font-size="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Number of Winners
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{win.numberOfWinners}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div font-size="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Final Number
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{win.finalNumber}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div font-size="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Your Number
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{win.yourNumber}</div>
                                                    </div>
                                                </div>
                                                <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC jdlnRz">
                                                    <div font-size="12px" color="textSubtle"
                                                         className="sc-be365e-0 dmGxwu">Your Amount of Bet
                                                    </div>
                                                    <div className="sc-c4ec0fdf-0 sc-32d5f017-0 dGKbaC chfQFH">
                                                        <div color="text" className="sc-be365e-0 krVkBZ">{win.yourBet}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {win.claimable ?
                                                        (
                                                            <button class="btn" type="button" roundNumber={win.roundNumber} onClick={handleClaim}>Claim</button>
                                                        ) :
                                                            <p>Claimed</p>}
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
    }


    return (
        <div class="container">
        <div class="row text-center justify-content-center">
            {
                fillInWins()
            }

            {/*<img class="card-img-top" src="..." alt="Card image cap">*/}
{/*            <div class="card-body">*/}
{/*                <h5 class="card-title align-middle">Upcoming Round</h5>*/}
{/*                <form className="login100-form validate-form">*/}

{/*                    <div class="wrap-input100 validate-input m-b-10" data-validate="Bet value is required">*/}
{/*                        <input class="input100" type="text" name="betValue"*/}
{/*                               value={betValue}*/}
{/*                               onChange={(e) => setBetValue(e.target.value)}*/}
{/*                               placeholder="Bet value"/>*/}
{/*                        <span class="focus-input100"></span>*/}
{/*                        <span class="symbol-input100">*/}
{/*<i class="fa fa-user"></i>*/}
{/*</span>*/}
{/*                    </div>*/}
{/*                    <div class="wrap-input100 validate-input m-b-10" data-validate="Amount is required">*/}
{/*                        <input class="input100" type="text" name="amount"*/}
{/*                               value={GMBToken}*/}
{/*                               onChange={(e) => setGMBToken(e.target.value)} placeholder="GMB amount"/>*/}
{/*                        <span class="focus-input100"></span>*/}
{/*                        <span class="symbol-input100">*/}
{/*<i class="fa fa-lock"></i>*/}
{/*</span>*/}
{/*                    </div>*/}
{/*                    <div class="container-login100-form-btn p-t-10">*/}
{/*                        <input className="btn" type="submit" value="Participate"*/}
{/*                               onClick={handleParticipation}/>*/}

{/*                    </div>*/}


{/*                </form>*/}
{/*            </div>*/}
        </div>
        </div>
    )
};

export default Rewards;


