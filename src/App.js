import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Gambling from "./gambling-page-participate";
import Header from "./gambling-page-head";
import History from "./gambling-page-history";
import Lending from "./lending-page";
import Swap from "./swap-page-swap";
import GMBApproval from "./approval-page-gmb"
import LPApproval from "./approval-page-lp"
import "./App.css";
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from "react-router-dom";

export function App() {
	return (
		<Router>
			<div>
				{/*<nav>*/}
				{/*	<ul>*/}
				{/*		<li>*/}
				{/*			<Link to="/swap">Swap</Link>*/}
				{/*		</li>*/}
				{/*		<li>*/}
				{/*			<Link to="/gambling">Gamble</Link>*/}
				{/*		</li>*/}
				{/*	</ul>*/}
				{/*</nav>*/}

				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Routes>
					{/*<Route path="/about">*/}
					{/*	<About />*/}
					{/*</Route>*/}
					<Route path="/swap" element={<SwapPage />}/>
					<Route path="/gambling" element={<GamblingPage />} />
					<Route path="/lending" element={<LendingPage />} />
					<Route path="/" element={<IndexPage />} />
					<Route path="/approve" element={<ApprovalPage />} />
					{/*<Route path="/">*/}
					{/*	<Home />*/}
					{/*</Route>*/}
				</Routes>
				<ToastContainer />
			</div>
		</Router>
	);
}

function IndexPage() {
	return (
		<>
			<div height="56" className="sc-4cbab3e3-2 elkeBC">
				<Header/>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-3" style={{"margin-top": "330px"}}>
						<Link to="/swap">
							<img src="https://img.icons8.com/nolan/96/replace.png" width={130}/>
						</Link>
					</div>
					<div className="col-md-6">
						<img src="https://i.ibb.co/CshX8s7/gambleswap.png" alt="gambleswap" border="0" style={{"margin-top": "250px", "width": "300px", "opacity": "0.5"}}></img>
					</div>
					<div className="col-md-3" style={{"margin-top": "330px"}}>
						<Link to="/gambling">
							<img src="https://img.icons8.com/nolan/96/dice.png" width={130}/>
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

function GamblingPage() {
	return (
		<>
			<div height="56" className="sc-4cbab3e3-2 elkeBC">
				<Header/>
			</div>
			<hr/>
			<div className="container">
				<div className="row justify-content-center" style={{marginTop: "50px"}}>
					<div className="col-md-8 App">
						<Gambling />
					</div>
				</div>
			</div>
			<hr/>
			<History />
		</>
	);
}

function LendingPage() {
	return (
		<>
			<div height="56" className="sc-4cbab3e3-2 elkeBC">
				<Header/>
			</div>
			<hr/>
			<div className="container">
				<div className="row justify-content-center" style={{marginTop: "50px"}}>
					<div className="col-md-8 App">
						<Lending />
					</div>
				</div>
			</div>
			{/*<hr/>*/}
			{/*<History />*/}
		</>
	);
}

function SwapPage() {
	return (
		<>
			<div height="56" className="sc-4cbab3e3-2 elkeBC">
				<Header/>
			</div>
			<hr/>
			<div className="container">
				<div className="row justify-content-center" style={{marginTop: "50px"}}>
					<div className="col-md-8 App">
						<Swap />
					</div>
				</div>
			</div>
			<hr/>
			{/*<History />*/}
		</>
	);
}

function ApprovalPage() {
	return (
		<>
			<div height="56" className="sc-4cbab3e3-2 elkeBC">
				<Header/>
			</div>
			<hr/>
			<div className="container">
				<div className="row justify-content-center" style={{marginTop: "50px"}}>
					<div className="col-md-12 App">
						<GMBApproval />
					</div>
				</div>
				<hr></hr>
				<div className="row justify-content-center">
					<div className="col-md-12 App">
						<LPApproval />
					</div>
				</div>
			</div>
		</>
	);
}


