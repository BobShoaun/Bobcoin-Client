import "./App.css";
import Dashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
	return (
		<div>
      <Navbar></Navbar>
			<div className="container">
				<Dashboard />
			</div>
      <Footer></Footer>
		</div>
	);
}

export default App;
