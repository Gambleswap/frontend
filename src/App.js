import Gambling from "./gambling-page-participate";
import Header from "./gambling-page-head";
import History from "./gambling-page-history";
import Swap from "./swap-page-swap";
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
					{/*<Route path="/">*/}
					{/*	<Home />*/}
					{/*</Route>*/}
				</Routes>
			</div>
		</Router>
	);
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

