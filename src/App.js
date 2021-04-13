import Dashboard from "./pages/dashboard";
import GenerateKey from "./pages/generateKey";
import Mine from "./pages/mine";
import Wallet from "./pages/wallet";
import NewTransaction from "./pages/newTransaction";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
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
					<Route path="/wallet/:publicKey" component={Wallet}></Route>
					<Route path="/">
						<Dashboard />
					</Route>
				</Switch>
			</div>
			<Footer></Footer>
		</Router>
	);
}

export default App;
