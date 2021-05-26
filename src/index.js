import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import "bulma/css/bulma.css";

import { Provider } from "react-redux";
import store from "./store";

import { newBlock } from "./store/blockchainSlice";
import { newTransaction } from "./store/transactionsSlice";

import {
	mineGenesisBlock,
	resetTransactionSets,
	resetUtxoSets,
	createCoinbaseTransaction,
} from "blockcrypto";

// const store = createStore(
// 	rootReducer,
// 	loadFromLocalStorage(),
// 	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// store.subscribe(() => saveToLocalStorage(store.getState()));

// function saveToLocalStorage(state) {
// 	try {
// 		const serializedState = JSON.stringify(state);
// 		localStorage.setItem("state", serializedState);
// 	} catch (e) {
// 		console.log(e);
// 	}
// }

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

resetTransactionSets();
resetUtxoSets();

// const address = "8obdgEpD9kqU8RqAH6j53j9bX2U62VV";
// // sk: bob

// const blockchain = store.getState().blockchain.chain;
// const params = store.getState().blockchain.params;

// const coinbase = createCoinbaseTransaction(params, blockchain, null, [], address);
// store.dispatch(newTransaction(coinbase));

// const genesis = mineGenesisBlock(params, [coinbase]);
// store.dispatch(newBlock(genesis));

console.log(store.getState());

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
