import {
    connectWallet,
    uniswapRoute,
} from "./util/interact.js";
import {TradeType} from "@gambleswap/sdk";
import React from "react";
import {getCurrentWalletConnected, loadLPTokenAccountBalance, removeLiquidity, toEther, toWei} from "./util/interact";
// import {BigInt} from "big-integer"

class LiquidityProviding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletAddress: "",
            remove: {
                token0: "",
                token1: "",
                amount: "",
                balance: ""
            }
        };
    }

    setRemoveBalance(_new) {
        this.setState(state => {
            state.remove.balance = _new;
            return state
        })
    }

    setRemoveAmount(_new) {
        this.setState(state => {
            state.remove.amount = _new;
            return state
        })
    }

    setRemoveToken0(_new) {
        this.setState(state => {
            state.remove.token0 = _new;
            return state
        })
    }

    setRemoveToken1(_new) {
        this.setState(state => {
            state.remove.token1 = _new;
            return state
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
        var amount;
        if (this.state.remove.token0 !== "" && this.state.remove.token1 !== "") {
            try {
                amount = (await loadLPTokenAccountBalance(this.state.walletAddress, this.state.remove.token0, this.state.remove.token1)) / 10 ** 18;
            } catch {
                amount = ""
            }
        }
        else
            amount = "";

        this.setRemoveBalance(amount)

    };

    fetchData = async () => {
        try {
            const {address, status} = await getCurrentWalletConnected();
            this.setWallet(address);
            await setInterval(() => this.fetchBalances(), 3000);
        } catch (e) {

        }
    };


    componentDidMount = async () => {
        this.addWalletListener();
        await this.connectWalletPressed();
        await this.fetchData();
    };


    connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        this.setStatus(walletResponse.status);
        this.setWallet(walletResponse.address);
    };

    handleRemove = async (e) => {

        e.preventDefault();
        await removeLiquidity(this.state.walletAddress, this.state.remove.token0, this.state.remove.token1, toWei(this.state.remove.amount))
    };


    handleRemoveAmountChange = async (_amount) => {

        if (this.state.remove.token0 === "" || this.state.remove.token1 === "") {
            this.setRemoveAmount("");
            return;
        }
        if (_amount === "") {
            this.setRemoveAmount("");
            return;
        }
        try {
            toWei(_amount)
        } catch (e) {
            return
        }
        try {
            if (this.state.remove.balance < parseFloat(_amount)) {
                this.setRemoveAmount(this.state.remove.balance);
            }
            else
                this.setRemoveAmount(_amount);
        } catch (e) {

        }

    };

    removeLiquidity() {
        return (
            <div className="card participate">
                {/*<img className="card-img-top" src="..." alt="Card image cap">*/}
                <div className="card-body">
                    <h5 className="card-title align-middle">Remove Liquidity</h5>
                    <div>
                        <form className="login100-form validate-form" //id="participation-form"
                              onSubmit={this.handleRemove}>
                            <div className="wrap-input100 validate-input m-b-10"
                                 data-validate="Token0 is required">
                                <input className="input100" type="text" name="Token0"
                                       value={this.state.token0}
                                       onChange={(e) => this.setRemoveToken0(e.target.value)}
                                       placeholder="Token0"/>
                            </div>
                            <div className="wrap-input100 validate-input m-b-10"
                                 data-validate="Token1 is required">
                                        <input className="input100" type="text" name="Token1"
                                               value={this.state.remove.token1}
                                               onChange={(e) => this.setRemoveToken1(e.target.value)}
                                               placeholder="Token1"/>
                            </div>

                            <div className="wrap-input100 validate-input m-b-10">
                                <div style={{display: "table"}}>
                                    <div style={{display: "table-cell"}}>
                                        <input className="input100" type="text" name="amount"
                                               value={this.state.remove.amount}
                                               onChange={(e) => this.handleRemoveAmountChange(e.target.value)}
                                               placeholder="Amount"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "50%"}}>
                                        <span>{this.state.remove.balance}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="container-login100-form-btn p-t-10">
                                <input className="btn" value="Remove" type="submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }

    render() {
        return this.removeLiquidity()
    }
}

export default LiquidityProviding;

