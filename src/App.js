import Gambling from "./gambling-page-participate";
import Header from "./gambling-page-head";
import History from "./gambling-page-history";
import "./App.css";
import React from "react";

export function App() {
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

