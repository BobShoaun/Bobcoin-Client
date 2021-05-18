import { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import GenerateKeyPage from "./pages/GenerateKeyPage";
import MinePage from "./pages/MinePage/MinePage";
import WalletPage from "./pages/WalletPage";
import NewTransactionPage from "./pages/NewTransactionPage";
import BlockPage from "./pages/BlockPage";
import TransactionPage from "./pages/TransactionPage/TransactionPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
						<GenerateKeyPage />
					</Route>
					<Route path="/new-transaction">
						<NewTransactionPage />
					</Route>
					<Route path="/mine">
						<MinePage />
					</Route>

					<Route path="/block/:hash" component={BlockPage}></Route>
					<Route path="/transaction/:hash" component={TransactionPage}></Route>

					<Route path="/wallet/:publicKey" component={WalletPage}></Route>
					<Route path="/wallet" component={WalletPage}></Route>
					<Route path="/">
						<DashboardPage />
					</Route>
				</Switch>
			</div>
			<Link
				style={{ ...floatingButton, width: buttonWidth }}
				onMouseEnter={() => setButtonWidth("auto")}
				onMouseLeave={() => setButtonWidth("4rem")}
				to="/new-transaction"
				className="button is-link"
			>
				<span className="icon material-icons md-36">attach_money</span>
				{buttonWidth === "auto" && <strong>New Transaction</strong>}
			</Link>
			<Footer></Footer>
		</Router>
	);
};

export default App;
