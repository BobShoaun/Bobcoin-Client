import Dashboard from "./pages/dashboard";
import GenerateKey from "./pages/generateKey";
import Mine from "./pages/mine";
import Wallet from "./pages/wallet";
import NewTransaction from "./pages/newTransaction";
import Block from "./pages/block";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";

const App = () => {
	const [buttonWidth, setButtonWidth] = useState("4rem");
	const floatingButton = {
		position: "fixed",
		right: "2rem",
		bottom: "2rem",
		borderRadius: "2rem",
		height: "4rem",
	};
	return (
		<Router>
			<Navbar></Navbar>
			<div className="container">
				<Switch>
					<Route path="/generate-key">
						<GenerateKey />
					</Route>
					<Route path="/new-transaction">
						<NewTransaction />
					</Route>
					<Route path="/mine">
						<Mine />
					</Route>

					<Route path="/block/:hash" component={Block}></Route>

					<Route path="/wallet/:publicKey" component={Wallet}></Route>
					<Route path="/wallet" component={Wallet}></Route>
					<Route path="/">
						<Dashboard />
					</Route>
				</Switch>
			</div>
			<a
				style={{ ...floatingButton, width: buttonWidth }}
				onMouseEnter={() => setButtonWidth("auto")}
				onMouseLeave={() => setButtonWidth("4rem")}
				href="/new-transaction"
				className="button is-link"
			>
				<span className="icon material-icons md-36">attach_money</span>
				{buttonWidth === "auto" && <strong>New Transaction</strong>}
			</a>
			<Footer></Footer>
		</Router>
	);
};

export default App;
