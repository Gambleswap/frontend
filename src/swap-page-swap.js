import {
    connectWallet,
    uniswapRoute,
} from "./util/interact.js";
import {TradeType} from "@gambleswap/sdk";
import React from "react";
import {getCurrentWalletConnected, loadTokenAccountBalance} from "./util/interact";

class Swap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletAddress: "",
            fromToken: "",
            toToken: "",
            amount: "",
            type: "",
        };
    }

    setAmount(_new) {
        this.setState(state => {
            let {amount, ...remaining} = state;
            remaining.amount = _new
        })
    }

    setToToken(_new) {
        this.setState(state => {
            let {toToken, ...remaining} = state;
            remaining.toToken = _new
        })
    }

    setFromToken(_new) {
        this.setState(state => {
            let {fromToken, ...remaining} = state;
            remaining.fromToken = _new
        })
    }

    setStatus(_new) {
        this.setState(state => {
            let {status, ...remaining} = state;
            remaining.status = _new
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

    fetchData = async () => {
        const { address, status } = await getCurrentWalletConnected();
        this.setWallet(address);
    };


    componentDidMount = async () => {
        this.addWalletListener();
        await this.fetchData();
        this.interval = setInterval(() => this.fetchData(), 3000);
    };


    connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        this.setStatus(walletResponse.status);
        this.setWallet(walletResponse.address);
    };

    handleSwap = async () => {

        const RAD = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
        const DNI = "0x71C95911E9a5D330f4D621842EC243EE1343292e";

        uniswapRoute(this.state.walletAddress, RAD, DNI, this.state.walletAddress, "1000000000000000000", TradeType.EXACT_INPUT, 0.5);
        this.interval = setInterval(() => this.fetchData(), 3000);
    };

    render() {
        return (
            <div className="card participate">
                {/*<img className="card-img-top" src="..." alt="Card image cap">*/}
                <div className="card-body">
                    <h5 className="card-title align-middle">Swap</h5>
                    <div>
                        <form className="login100-form validate-form" //id="participation-form"
                              onSubmit={this.handleSwap}>
                            <div className="wrap-input100 validate-input m-b-10"
                                 data-validate="Bet value is required">
                                <input className="input100" type="text" name="fromToken"
                                       value={this.state.fromToken}
                                       onChange={(e) => this.setFromToken(e.target.value)}
                                       placeholder="From"/>

                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                            <div className="wrap-input100 validate-input m-b-10"
                                 data-validate="Amount is required">
                                <input className="input100" type="text" name="toToken"
                                       value={this.state.toToken}
                                       onChange={(e) => this.setToToken(e.target.value)}
                                       placeholder="To"/>
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </div>
                            <div className="wrap-input100 validate-input m-b-10"
                                 data-validate="From amount is required">
                                <input className="input100" type="text" name="amount"
                                       value={this.state.amount}
                                       onChange={(e) => this.setAmount(e.target.value)}
                                       placeholder="Amount"/>

                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                            {/*<div className="wrap-input100 validate-input m-b-10"*/}
                            {/*     data-validate="Amount is required">*/}
                            {/*    <input className="input100" type="text" name="amount"*/}
                            {/*           value={this.state.gmbAmount}*/}
                            {/*           onChange={(e) => this.setGMBAmount(e.target.value)}*/}
                            {/*           placeholder="To amount"/>*/}
                            {/*    <span className="focus-input100"></span>*/}
                            {/*    <span className="symbol-input100">*/}
                            {/*        <i className="fa fa-lock"></i>*/}
                            {/*    </span>*/}
                            {/*</div>*/}
                            <div className="container-login100-form-btn p-t-10">
                                <input className="btn" value="Swap" type="submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}

export default Swap;

