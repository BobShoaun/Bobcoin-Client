import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import "bulma/css/bulma.css";
// import { createStore } from "redux";
// import rootReducer from "./reducers";

import store from "./store";
import { Provider } from "react-redux";

// const store = createStore(
// 	rootReducer,
// 	loadFromLocalStorage(),
// 	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

store.subscribe(() => saveToLocalStorage(store.getState()));

function saveToLocalStorage(state) {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem("state", serializedState);
	} catch (e) {
		console.log(e);
	}
}

// function loadFromLocalStorage() {
// 	try {
// 		const serializedState = localStorage.getItem("state");
// 		if (serializedState === null) return undefined;
// 		const blockchain = new Cryptocurrency();
// 		const blockchainJson = JSON.parse(serializedState).blockchain;
// 		blockchain.chain = blockchainJson.chain;
// 		blockchain.transactions = blockchainJson.transactions;
// 		return { blockchain };
// 	} catch (e) {
// 		console.log(e);
// 		return undefined;
// 	}
// }

console.log(store.getState());

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
