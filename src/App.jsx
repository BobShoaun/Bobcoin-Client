import { useState, useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewTransactionAction from "./components/NewTransactionAction";
import Loading from "./components/Loading";

import io from "socket.io-client";
import { bobcoinMainnet, bobcoinTestnet } from "./config";

import SocketContext from "./socket/SocketContext";
import { initializeSocket } from "./socket/socket";
import { resetTransactionSets, resetUtxoSets } from "blockcrypto";

import { resetBlockchain } from "./store/blockchainSlice";
import { resetParams } from "./store/consensusSlice";
import { resetTransactions } from "./store/transactionsSlice";

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
	const dispatch = useDispatch();
	const network = useSelector(state => state.blockchain.network);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		resetTransactionSets();
		resetUtxoSets();

		socket?.disconnect();
		const soc = io(network === "mainnet" ? bobcoinMainnet : bobcoinTestnet);

		dispatch(resetBlockchain());
		dispatch(resetTransactions());
		dispatch(resetParams());

		initializeSocket(soc);
		setSocket(soc);
	}, [network]);

	return (
		<SocketContext.Provider value={{ socket, setSocket }}>
			<Router>
				<main className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
					<Navbar />
					<Suspense fallback={<Loading />}>
						<div className="container" style={{ width: "100%", height: "100%" }}>
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
						<div style={{ display: "none" }} className="is-block-desktop">
							<NewTransactionAction />
						</div>
					</Suspense>
					<Footer />
				</main>
			</Router>
		</SocketContext.Provider>
	);
};

export default App;
