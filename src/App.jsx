import { useState, useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewTransactionAction from "./components/NewTransactionAction";

import io from "socket.io-client";
import { bobcoinMainnet, bobcoinTestnet } from "./config";

import SocketContext from "./socket/SocketContext";
import { initializeSocket } from "./socket/socket";
import { resetTransactionSets, resetUtxoSets } from "blockcrypto";

const OverviewPage = lazy(() => import("./pages/DashboardPage"));
const GenerateKeyPage = lazy(() => import("./pages/GenerateKeyPage"));
const MinePage = lazy(() => import("./pages/MinePage"));
const AddressPage = lazy(() => import("./pages/AddressPage"));
const NewTransactionPage = lazy(() => import("./pages/NewTransactionPage"));
const BlockPage = lazy(() => import("./pages/BlockPage"));
const TransactionPage = lazy(() => import("./pages/TransactionPage"));
const BlockchainPage = lazy(() => import("./pages/BlockchainPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const App = () => {
	const network = useSelector(state => state.blockchain.network);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		resetTransactionSets();
		resetUtxoSets();

		socket?.disconnect();
		const soc = io(network === "mainnet" ? bobcoinMainnet : bobcoinTestnet);
		initializeSocket(soc);
		setSocket(soc);
	}, [network]);

	return (
		<SocketContext.Provider value={{ socket, setSocket }}>
			<Router>
				<Suspense
					fallback={
						<div className="is-flex h-100">
							<h1 className="subtitle m-auto">Just a moment...</h1>
						</div>
					}
				>
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
							<Route path="/overview" component={OverviewPage} />
							<Route path="/" component={LandingPage} />
						</Switch>
					</div>
					<NewTransactionAction />
					<Footer></Footer>
				</Suspense>
			</Router>
		</SocketContext.Provider>
	);
};

export default App;
