import "./App.css";
import Dashboard from "./components/dashboard";
import Navbar from "./components/navbar";

function App() {
	return (
		<div>
      <Navbar></Navbar>
			<div className="container">
				<Dashboard />
			</div>
		</div>
	);
}

export default App;
