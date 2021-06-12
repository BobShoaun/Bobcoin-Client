import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import GenerateKeyPage from "./pages/GenerateKeyPage";
import MinePage from "./pages/MinePage";
import AddressPage from "./pages/AddressPage";
import NewTransactionPage from "./pages/NewTransactionPage";
import BlockPage from "./pages/BlockPage";
import TransactionPage from "./pages/TransactionPage";
import BlockchainPage from "./pages/BlockchainPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import io from "socket.io-client";
import { bobcoinMainnet, bobcoinTestnet } from "./config";

import SocketContext from "./socket/SocketContext";
import { initializeSocket } from "./socket/socket";
import { resetTransactionSets, resetUtxoSets } from "blockcrypto";

const App = () => {
	const [buttonWidth, setButtonWidth] = useState("0 0 auto");
	const [expandButton, setExpandButton] = useState(false);

	const floatingButton = {
		position: "fixed",
		right: "2rem",
		bottom: "2rem",
		borderRadius: "2rem",
		height: "4rem",
	};

	const network = useSelector(state => state.blockchain.network);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		resetTransactionSets();
		resetUtxoSets();

		socket?.disconnect(SVGComponentTransferFunctionElement);
		const soc = io(network === "mainnet" ? bobcoinMainnet : bobcoinTestnet);
		initializeSocket(soc);
		setSocket(soc);
	}, [network]);

	return (
		<SocketContext.Provider value={{ socket, setSocket }}>
			<Router>
				<Navbar></Navbar>
				<div className="container">
					<Switch>
						<Route path="/generate-key" component={GenerateKeyPage} />
						<Route path="/new-transaction" component={NewTransactionPage} />
						<Route path="/mine" component={MinePage} />
						<Route path="/blockchain" component={BlockchainPage} />

						<Route path="/block/:hash" component={BlockPage}></Route>
						<Route path="/transaction/:hash" component={TransactionPage}></Route>

						<Route path="/address/:address" component={AddressPage}></Route>
						<Route path="/address" component={AddressPage}></Route>
						<Route path="/settings" component={SettingsPage} />
						<Route path="/overview" component={DashboardPage} />
						<Route path="/" component={LandingPage} />
					</Switch>
				</div>
				<Link
					style={{
						...floatingButton,
						overflow: "hidden",
					}}
					onMouseEnter={() => setExpandButton(true)}
					onMouseLeave={() => setExpandButton(false)}
					to="/new-transaction"
					className="button is-link"
				>
					<div className="is-flex is-align-items-center test">
						<span
							style={{
								transform: expandButton ? "rotate(360deg)" : "rotate(0deg)",
								transition: "transform 0.5s ease-in-out 0.3s",
							}}
							className="material-icons md-36"
						>
							attach_money
						</span>
						<strong
							style={{
								transition: "width 0.4s ease-out",
								visibility: expandButton ? "visible" : "hidden",
								width: expandButton ? "10rem" : "0rem",
							}}
						>
							New Transaction
						</strong>
					</div>
				</Link>
				<Footer></Footer>
			</Router>
		</SocketContext.Provider>
	);
};

export default App;
