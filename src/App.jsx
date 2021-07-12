import { useState, useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewTransactionAction from "./components/NewTransactionAction";
import Loading from "./components/Loading";

import io from "socket.io-client";

import SocketContext from "./socket/SocketContext";
import { initializeSocket } from "./socket/socket";

import { reset } from "./store/blockchainSlice";
import { resetParams } from "./store/consensusSlice";

const OverviewPage = lazy(() => import("./pages/OverviewPage"));
const GenerateKeysPage = lazy(() => import("./pages/GenerateKeysPage"));
const MinePage = lazy(() => import("./pages/MinePage"));
const AddressPage = lazy(() => import("./pages/AddressPage/"));
const NewTransactionPage = lazy(() => import("./pages/NewTransactionPage"));
const BlockPage = lazy(() => import("./pages/BlockPage"));
const TransactionPage = lazy(() => import("./pages/TransactionPage"));
const BlockchainPage = lazy(() => import("./pages/BlockchainPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ParametersPage = lazy(() => import("./pages/ParametersPage"));
const ReceivePage = lazy(() => import("./pages/ReceivePage"));
const FaucetPage = lazy(() => import("./pages/FaucetPage"));
const NodePage = lazy(() => import("./pages/NodePage"));
const DeveloperPage = lazy(() => import("./pages/DeveloperPage"));

const App = () => {
	const dispatch = useDispatch();
	const api = useSelector(state => state.network.api);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		socket?.disconnect();
		const soc = io(api);

		dispatch(reset());
		dispatch(resetParams());

		initializeSocket(soc);
		setSocket(soc);
	}, [api]);

	return (
		<SocketContext.Provider value={{ socket, setSocket }}>
			<Router>
				<main className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
					<Navbar />
					<Suspense fallback={<Loading />}>
						<div className="container" style={{ width: "100%", height: "100%" }}>
							<Switch>
								<Route path="/generate-key" component={GenerateKeysPage} />
								<Route path="/send" component={NewTransactionPage} />
								<Route path="/receive" component={ReceivePage} />
								<Route path="/mine" component={MinePage} />
								<Route path="/blockchain" component={BlockchainPage} />
								<Route path="/block/:hash" component={BlockPage}></Route>
								<Route path="/transaction/:hash" component={TransactionPage}></Route>
								<Route path="/address/:address" component={AddressPage}></Route>
								<Route path="/settings" component={SettingsPage} />
								<Route path="/parameters" component={ParametersPage} />
								<Route path="/overview" component={OverviewPage} />
								<Route path="/faucet" component={FaucetPage} />
								<Route path="/node" component={NodePage} />
								<Route path="/developer" component={DeveloperPage} />
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
