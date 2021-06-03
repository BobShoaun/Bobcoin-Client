import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";
import store from "./store";
import { initializeSocket } from "./socket/socket";

import { resetTransactionSets, resetUtxoSets } from "blockcrypto";

resetTransactionSets();
resetUtxoSets();

console.log(store.getState());

initializeSocket();

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
