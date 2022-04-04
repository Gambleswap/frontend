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
    };

    const handleClaim = async () => {
        setBetValue(gameNumber);
        const res = await claimPrize(walletAddress, gameNumber);
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
        }
    ]


    return (
        <div class="container">
        <div class="row text-center justify-content-center">
        <div class="card participate col-md-4">
            {/*<img class="card-img-top" src="..." alt="Card image cap">*/}
            <div class="card-body">
                <h5 class="card-title align-middle">Upcoming Round</h5>
                <form className="login100-form validate-form">

                    <div class="wrap-input100 validate-input m-b-10" data-validate="Bet value is required">
                        <input class="input100" type="text" name="betValue"
                               value={betValue}
                               onChange={(e) => setBetValue(e.target.value)}
                               placeholder="Bet value"/>
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
<i class="fa fa-user"></i>
</span>
                    </div>
                    <div class="wrap-input100 validate-input m-b-10" data-validate="Amount is required">
                        <input class="input100" type="text" name="amount"
                               value={GMBToken}
                               onChange={(e) => setGMBToken(e.target.value)} placeholder="GMB amount"/>
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
<i class="fa fa-lock"></i>
</span>
                    </div>
                    <div class="container-login100-form-btn p-t-10">
                        <input className="btn" type="submit" value="Participate"
                               onClick={handleParticipation}/>

                    </div>


                </form>
            </div>
        </div>
        </div>
        </div>

    )
};

export default Rewards;


{/*<label>Game Number:*/}
{/*	<input */}
{/*	type="text" */}
{/*	value={gameNumber}*/}
{/*	onChange={(e) => setGameNumber(e.target.value)}*/}
{/*	/>*/}
{/*</label>*/}
{/*<input type="submit" value="claim" onClick={handleClaim}/>*/}
{/*<p id="status">{status}</p>*/}