import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bulma/css/bulma.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import {Cryptocurrency} from 'blockchain-crypto';

const store = createStore(
	rootReducer,
  loadFromLocalStorage(),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => saveToLocalStorage(store.getState()))

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null)
      return undefined;
    const blockchain = new Cryptocurrency();
    const blockchainJson = JSON.parse(serializedState).blockchain;
    blockchain.chain = blockchainJson.chain;
    blockchain.transactions = blockchainJson.transactions;
    return { blockchain };
  }
  catch(e) {
    console.log(e);
    return undefined;
  }
}
// const transactions = [
//   {
//     hash: "1fdiasudfioafoiweuiweug2340823",
//     sender: "3094f9e8u3q98uf9348f342fae34fq34f",
//     recipient: "fiu34f394873n498vfn739487f3f",
//     amount: 12323.34,
//     fee: 0,
//   },
//   {
//     hash: "223adsfsdfasdfasdfasdfasdf",
//     sender: "3094f9e8u3q98uf9348f342fae34fq34f",
//     recipient: "fiu34f394873n498vfn739487f3f",
//     amount: 1423.34,
//     fee: 0,
//   },
//   {
//     hash: "3fdiasudfioafoiweuiweug2340823",
//     sender: "3094f9e8u3q98uf9348f342fae34fq34f",
//     recipient: "fiu34f394873n498vfn739487f3f",
//     amount: 123543.34,
//     fee: 1,
//   },
// ]

// for(let t of transactions) {
//   store.dispatch(addTransaction(t));
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
