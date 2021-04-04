import "./App.css";
import Dashboard from "./pages/dashboard";
import GenerateKey from "./pages/generateKey";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
	return (
		<Router>
			<Navbar></Navbar>
			<div className="container">
				<Switch>
					<Route exact path="/">
						<Dashboard />
					</Route>
					<Route path="/generate-key">
						<GenerateKey />
					</Route>
				</Switch>
			</div>
			<Footer></Footer>
		</Router>
	);
}

export default App;
