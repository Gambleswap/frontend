import Gambling from "./gambling-page-participate";
import Header from "./gambling-page-head";
import Rewards from "./gambling-page-claimables";
// import "./App.css";

export function App () {
	return (
		<div className="App">
			<Gambling></Gambling>
		</div>
	);
}

export function Head() {
	return (
		<div>
			<Header></Header>
		</div>
	);
}

export function Claimables() {
	return (
		<div>
			<Rewards></Rewards>
		</div>
	);
}
