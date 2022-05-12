import {
    connectWallet,
    pairExists,
} from "./util/interact.js";
import {TradeType} from "@gambleswap/sdk";
import React from "react";
import {
    addLiquidity, approveToken, claimGMBFromLP, GambleswapRouterAddress, getApproval, getAuthorizedPairs,
    getCurrentWalletConnected,
    getPair,
    loadLPTokenAccountBalance, loadTokenAccountBalance,
    removeLiquidity,
    toEther,
    toWei, validateAddress
} from "./util/interact";
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
                balance: "",
                authorised: false,
                pair: undefined,
                approve: {
                    active: false,
                    token: "",
                    address: ""
                }
            },
            add: {
                token0: {
                    address: "",
                    amount: "",
                    balance: ""
                },
                token1: {
                    address: "",
                    amount: "",
                    balance: ""
                },
                approve: {
                    active: false,
                    token: "",
                    address: ""
                }
            }
        };
    }

    setAddApprove(_new) {
        this.setState(state => {
            state.add.approve = _new;
            return state
        })
    }

    setRemoveAuthorised(_new) {
        this.setState(state => {
            state.remove.authorised = _new;
            return state
        })
    }

    setRemoveApprove(_new) {
        this.setState(state => {
            state.remove.approve = _new;
            return state
        })
    }

    setAddToken0Balance(_new) {
        this.setState(state => {
            state.add.token0.balance = _new;
            return state
        })
    }

    setAddToken1Balance(_new) {
        this.setState(state => {
            state.add.token1.balance = _new;
            return state
        })
    }

    setAddToken0Amount(_new) {
        this.setState(state => {
            state.add.token0.amount = _new;
            return state
        })
    }

    setAddToken1Amount(_new) {
        this.setState(state => {
            state.add.token1.amount = _new;
            return state
        })
    }

    setAddToken0Address(_new) {
        this.setState(state => {
            state.add.token0.address = _new;
            return state
        })
    }

    setAddToken1Address(_new) {
        this.setState(state => {
            state.add.token1.address = _new;
            return state
        })
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

    setRemovePair(_new) {
        this.setState(state => {
            state.remove.pair = _new;
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
        var flag = false;
        if (validateAddress(this.state.remove.token0) && validateAddress(this.state.remove.token1)) {
            try {
                const pair = await getPair(this.state.remove.token0, this.state.remove.token1);
                if (pair !== undefined) {
                    this.setRemovePair(pair);
                    const allowance = await getApproval(pair.liquidityToken.address, this.state.walletAddress, GambleswapRouterAddress);
                    amount = (await loadTokenAccountBalance(this.state.walletAddress, pair.liquidityToken.address)) / 10 ** 18;
                    this.setRemoveBalance(amount);
                    flag = true;
                    let isAuthorised = false;
                    let authorisedPools = await getAuthorizedPairs();
                    for (let i=0; i<=authorisedPools.length; i++){
                        if (authorisedPools[i] === pair.liquidityToken.address) {
                            isAuthorised = true;
                            break
                        }
                    }
                    this.setRemoveAuthorised(isAuthorised);

                    if (this.state.remove.amount !== "") {
                        if (allowance < toWei(this.state.remove.amount.toLocaleString('fullwide', {useGrouping: false}))) {
                            this.setRemoveApprove({
                                active: true,
                                token: pair.liquidityToken.address,
                                address: GambleswapRouterAddress
                            })
                        } else {
                            this.setRemoveApprove({
                                active: false,
                                token: "",
                                address: ""
                            })
                        }
                    }
                }
            } catch (e) {
                amount = "";
                console.log(e)
            }
        } else {
            amount = "";
        }
        if (!flag) {
            this.setRemoveBalance(amount);
            this.setRemoveAuthorised(false)
        }

        var amount0, amount1;
        if (validateAddress(this.state.add.token0.address)) {
            try {
                amount0 = toEther(await loadTokenAccountBalance(this.state.walletAddress, this.state.add.token0.address));
            } catch {
                amount0 = ""
            }
            try {
                const allowance0 = await getApproval(this.state.add.token0.address, this.state.walletAddress, GambleswapRouterAddress);
                const allowance1 = await getApproval(this.state.add.token1.address, this.state.walletAddress, GambleswapRouterAddress);
                if (allowance0 < toWei(this.state.add.token0.amount.toLocaleString('fullwide', {useGrouping:false}))) {
                    this.setAddApprove({
                        active: true,
                        token: this.state.add.token0.address,
                        address: GambleswapRouterAddress
                    })
                }
                else if (allowance1 < toWei(this.state.add.token1.amount.toLocaleString('fullwide', {useGrouping:false}))) {
                    this.setAddApprove({
                        active: true,
                        token: this.state.add.token1.address,
                        address: GambleswapRouterAddress
                    })
                } else {
                    this.setAddApprove({
                        active: false,
                        token: "",
                        address: ""
                    })
                }
            } catch (e) {
            }
        } else
            amount0 = "";

        if (validateAddress(this.state.add.token1.address)) {
            try {
                amount1 = toEther(await loadTokenAccountBalance(this.state.walletAddress, this.state.add.token1.address));
            } catch {
                amount1 = ""
            }
        } else amount1 = "";

        this.setAddToken0Balance(amount0);
        this.setAddToken1Balance(amount1);
    };

    fetchData = async () => {
        try {
            const {address, status} = await getCurrentWalletConnected();
            this.setWallet(address);
            await setInterval(() => this.fetchBalances(), 1000);
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

    handleAdd = async (e) => {
        e.preventDefault();
        console.log(this.state);
        console.log(toWei(`${this.state.add.token0.amount}`));
        console.log(toWei(`${this.state.add.token1.amount}`));
        console.log((toWei(`${this.state.add.token0.amount}`)*0.9).toLocaleString('fullwide', {useGrouping:false}));
        console.log((toWei(`${this.state.add.token1.amount}`)*0.9).toLocaleString('fullwide', {useGrouping:false}));
        if (this.state.add.token0.address > this.state.add.token1.address) {
            await addLiquidity(
                this.state.add.token1.address,
                this.state.add.token0.address,
                toWei(this.state.add.token1.amount),
                toWei(this.state.add.token0.amount),
                (toWei(`${this.state.add.token1.amount}`)*0.9).toLocaleString('fullwide', {useGrouping:false}),
                (toWei(`${this.state.add.token0.amount}`)*0.9).toLocaleString('fullwide', {useGrouping:false}),
                this.state.walletAddress
            )

        } else {
            await addLiquidity(
                this.state.add.token0.address,
                this.state.add.token1.address,
                toWei(this.state.add.token0.amount),
                toWei(this.state.add.token1.amount),
                (toWei(`${this.state.add.token0.amount}`)*0.9).toLocaleString('fullwide', {useGrouping:false}),
                (toWei(`${this.state.add.token1.amount}`)*0.9).toLocaleString('fullwide', {useGrouping:false}),
                this.state.walletAddress
            )
        }
    };

    handleAddAmountChange = async (type, _amount) => {
        if (!validateAddress(this.state.add.token0.address) || !validateAddress(this.state.add.token1.address)) {
            this.setAddToken0Amount("");
            this.setAddToken1Amount("");
            return;

        }
        if (_amount === "") {
            this.setAddToken0Amount("");
            this.setAddToken1Amount("");
            return;
        }
        try {
            toWei(_amount)
        } catch (e) {
            console.log(e);
            return
        }

        const pair = await getPair(this.state.add.token0.address, this.state.add.token1.address);
        if (pair !== undefined) {
            // console.log(pair.reserve0.toSignificant(10));
            // console.log(pair.reserve1.toSignificant(10));
            // console.log(pair.reserve1.divide(pair.reserve0));
            // console.log(pair.reserve1.divide(pair.reserve0).toFixed(30));
            if (TradeType.EXACT_INPUT === type) {
                if (this.state.add.token0.address > this.state.add.token1.address) {
                    let amountA = toWei(_amount);
                    let amountB = pair.reserve0.multiply(amountA).divide(pair.reserve1);
                    this.setAddToken0Amount(_amount);
                    this.setAddToken1Amount(toEther(amountB.toFixed(0)))

                } else {
                    let amountA = toWei(_amount);
                    let amountB = pair.reserve1.multiply(amountA).divide(pair.reserve0);
                    this.setAddToken0Amount(_amount);
                    this.setAddToken1Amount(toEther(amountB.toFixed(0)))
                }
            } else {
                if (this.state.add.token0.address > this.state.add.token1.address) {
                    let amountB = toWei(_amount);
                    let amountA = pair.reserve1.multiply(amountB).divide(pair.reserve0);
                    this.setAddToken1Amount(_amount);
                    this.setAddToken0Amount(toEther(amountA.toFixed(0)))
                } else {
                    let amountB = toWei(_amount);
                    let amountA = pair.reserve0.multiply(amountB).divide(pair.reserve1);
                    this.setAddToken1Amount(_amount);
                    this.setAddToken0Amount(toEther(amountA.toFixed(0)))
                }
            }
        } else {
            if (TradeType.EXACT_INPUT === type)
                this.setAddToken0Amount(_amount);
            else
                this.setAddToken1Amount(_amount)
        }
    };


    handleRemoveAmountChange = async (_amount) => {
        try {
            parseFloat(_amount);
            this.setRemoveAmount(_amount)
        } catch (e) {

        }

        if (!validateAddress(this.state.remove.token0) || !validateAddress(this.state.remove.token1)) {
            this.setRemoveAmount("");
            return;
        }
        const pair = await getPair(this.state.remove.token0, this.state.remove.token1);
        if (pair === undefined){
            this.setRemoveAmount("");
            return
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

    handleRemoveApprove = async (e) => {
        e.preventDefault();
        await approveToken(
            this.state.remove.approve.token,
            this.state.walletAddress,
            GambleswapRouterAddress
        )
    };

    handleClaimGMB = async (e) => {
        await claimGMBFromLP(this.state.walletAddress, this.state.remove.pair.liquidityToken.address);
    };

    removeLiquidity() {
        return (
            <div className="card participate">
                {/*<img className="card-img-top" src="..." alt="Card image cap">*/}
                <div className="card-body">
                    <h5 className="card-title align-middle">Remove Liquidity</h5>
                    <div>
                        <form className="login100-form validate-form" //id="participation-form"
                              onSubmit={
                                  this.state.remove.approve.active ?
                                      this.handleRemoveApprove :
                                      this.handleRemove
                              }>
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
                                {
                                    this.state.remove.authorised ?
                                    <div style={{display: "table-cell"}}>
                                        <div className="btn" onClick={this.handleClaimGMB}>Claim GMB</div>
                                    </div> : <></>
                                }
                                <div style={{display: "table-cell", width: "50%"}}>
                                    <input className="btn" value={
                                    this.state.remove.approve.active ? "Approve": "Remove"
                                    } type="submit"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }

    handleAddApprove = async (e) => {
        e.preventDefault();
        await approveToken(
            this.state.add.approve.token,
            this.state.walletAddress,
            GambleswapRouterAddress
        )
    };

    addLiquidity() {
        return (
            <div className="card participate">
                <div className="card-body">
                    <h5 className="card-title align-middle">Add Liquidity</h5>
                    <div>
                        <form className="login100-form validate-form" //id="participation-form"
                              onSubmit={
                                  this.state.add.approve.active ? this.handleAddApprove: this.handleAdd

                              }>
                            <div className="wrap-input100 validate-input m-b-10">
                                <div style={{display: "table"}}>
                                    <div style={{display: "table-cell"}}>
                                        <input className="input100" type="text" name="token0"
                                               value={this.state.add.token0.address}
                                               onChange={(e) => {
                                                   this.setAddToken0Address(e.target.value)
                                               }}
                                               placeholder="Token0"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "30%"}}>
                                        <input className="input100" type="text" name="token0Amount"
                                               value={this.state.add.token0.amount}
                                               onChange={(e) => this.handleAddAmountChange(TradeType.EXACT_INPUT, e.target.value)}
                                               placeholder="0"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "10%"}}>
                                        <span>{this.state.add.token0.balance}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="wrap-input100 validate-input m-b-10">
                                <div style={{display: "table"}}>
                                    <div style={{display: "table-cell"}}>
                                        <input className="input100" type="text" name="token1"
                                               value={this.state.add.token1.address}
                                               onChange={(e) => {
                                                   this.setAddToken1Address(e.target.value);
                                               }}
                                               placeholder="Token1"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "30%"}}>
                                        <input className="input100" type="text" name="token1Amount"
                                               value={this.state.add.token1.amount}
                                               onChange={(e) => this.handleAddAmountChange(TradeType.EXACT_OUTPUT, e.target.value)}
                                               placeholder="0"/>
                                    </div>
                                    <div style={{display: "table-cell", width: "10%"}}>
                                        <span>{this.state.add.token1.balance}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="container-login100-form-btn p-t-10">
                                <input className="btn" value={
                                    this.state.add.approve.active ? "Approve": "Add"
                                } type="submit"/>

                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }

    render() {
        return (
            <>
                {this.removeLiquidity()}
                <hr/>
                {this.addLiquidity()}
            </>
        )
    }
}

export default LiquidityProviding;

