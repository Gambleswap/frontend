import {
    connectWallet,
    uniswapRoute,
} from "./util/interact.js";
import {TradeType} from "@gambleswap/sdk";
import React from "react";
import {getAmount, getCurrentWalletConnected, loadTokenAccountBalance} from "./util/interact";
// import {BigInt} from "big-integer"

class Swap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletAddress: "",
            fromToken: "",
            toToken: "",
            to: "",
            type: "",
            amount: {from: "", to: ""},
            balance: {token0: "", token1: ""}
        };
    }

    setBalance(_new) {
        this.setState(state => {
            let {balance, ...remaining} = state;
            remaining.balance = _new;
            return remaining
        })
    }

    setType(_new) {
        this.setState(state => {
            let {type, ...remaining} = state;
            remaining.type = _new;
            return remaining
        })
    }
    //
    setAmount(_new) {
        this.setState(state => {
            let {amount, ...remaining} = state;
            remaining.amount = _new;
            return remaining
        })
    }

    setToToken(_new) {
        this.setState(state => {
            let {toToken, ...remaining} = state;
            remaining.toToken = _new;
            return remaining
        })
    }

    setFromToken(_new) {
        this.setState(state => {
            let {fromToken, ...remaining} = state;
            remaining.fromToken = _new;
            return remaining
        })
    }

    setStatus(_new) {
        this.setState(state => {
            let {status, ...remaining} = state;
            remaining.status = _new;
            return remaining
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

    fetchBalances = async () => {
        var amount0, amount1;
        if (this.state.fromToken !== "") {
            try {
                amount0 = (await loadTokenAccountBalance(this.state.walletAddress, this.state.fromToken)) / 10 ** 18;
            } catch {
                amount0 = ""
            }
        }
        else
            amount0 = "";

        if (this.state.toToken !== "") {
            try {
                amount1 = (await loadTokenAccountBalance(this.state.walletAddress, this.state.toToken)) / 10 ** 18;
            } catch {
                amount1 = ""
            }
        }
        else amount1 = "";

        this.setBalance(
            {
                token0: amount0,
                token1: amount1
            }
        )

    };

    fetchData = async () => {
        try {
            const {address, status} = await getCurrentWalletConnected();
            this.setWallet(address);
        } catch (e) {

        }
    };


    componentDidMount = async () => {
        this.addWalletListener();
        await this.connectWalletPressed();
        await this.fetchData();
        this.interval = setInterval(() => this.fetchBalances(), 1000);
    };


    connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        this.setStatus(walletResponse.status);
        this.setWallet(walletResponse.address);
    };

    handleSwap = async (e) => {
        e.preventDefault();
        // const RAD = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
        // const DNI = "0x71C95911E9a5D330f4D621842EC243EE1343292e";

        await uniswapRoute(
            this.state.walletAddress,
            this.state.fromToken ,
            this.state.toToken,
            this.state.walletAddress,
            this.state.type === TradeType.EXACT_INPUT ? this.state.amount.from*10**18 : this.state.amount.to*10**18,
            this.state.type,
            0.5
        );
    };

    handleAmountChange = async (type, _amount) => {
        if (this.state.fromToken === "" || this.state.toToken === "")
            return;
        if (_amount === "") {
            this.setAmount({from: "", to: ""});
            return;
        }
        let amount;
        try {
            if (_amount.includes("."))
                amount = parseFloat(_amount)*10**18;
            else
                amount = parseInt(_amount)*10**18
        } catch (e) {
            type === TradeType.EXACT_INPUT ?
                this.setAmount({from: amount, to: ""}) :
                this.setAmount({from: "", to: amount});
            return
        }



        // amount2.ToNumber() / Math.pow(10, 18)
        try {
            let amount2 = amount < 10 ? 0 : parseInt(await getAmount(this.state.fromToken, this.state.toToken, type,
                `${amount}`
                , 0.5));
            // console.log(type(amount2));

            type === TradeType.EXACT_INPUT ?
                this.setAmount({from: _amount, to: amount2/10**18}):
                this.setAmount({from: Number(amount2/(10**18)), to: _amount});
        } catch (e) {
            this.setAmount({from: "", to: ""})
        }
        this.setType(type);
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
                            <div className="wrap-input100 validate-input m-b-10">
                                <div style={{display: "table"}}>
                                    <div style={{display: "table-cell"}}>
                                        <input className="input100" type="text" name="fromToken"
                                               value={this.state.fromToken}
                                               onChange={(e) => this.setFromToken(e.target.value)}
                                               placeholder="From"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "30%"}}>
                                        <input className="input100" type="text" name="fromAmount"
                                               value={this.state.amount.from}
                                               onChange={(e) => this.handleAmountChange(TradeType.EXACT_INPUT, e.target.value)}
                                               placeholder="0"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "10%"}}>
                                        <span>{this.state.balance.token0}</span>
                                    </div>

                                    {/*<span className="focus-input100"></span>*/}
                                    {/*<span className="symbol-input100">*/}
                                    {/*    <i className="fa fa-user"></i>*/}
                                    {/*</span>*/}
                                </div>
                            </div>
                            <div className="wrap-input100 validate-input m-b-10">
                                <div style={{display: "table"}}>
                                    <div style={{display: "table-cell"}}>
                                        <input className="input100" type="text" name="toToken"
                                               value={this.state.toToken}
                                               onChange={(e) => this.setToToken(e.target.value)}
                                               placeholder="To"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "30%"}}>
                                        <input className="input100" type="text" name="toAmount"
                                               value={this.state.amount.to}
                                               onChange={(e) => this.handleAmountChange(TradeType.EXACT_OUTPUT, e.target.value)}
                                               placeholder="0"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "10%"}}>
                                        <span>{this.state.balance.token1}</span>
                                    </div>
                                </div>
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

