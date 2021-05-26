import { configureStore } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchainSlice";
import transactionsReducer from "./transactionsSlice";

import { addBlock, syncWithNode } from "./blockchainSlice";
import { addTransaction } from "./transactionsSlice";
import socket from "./socket";

const store = configureStore({
	reducer: {
		blockchain: blockchainReducer,
		transactions: transactionsReducer,
	},
});

socket.on("add block", block => {
	store.dispatch(addBlock(block));
});

socket.on("add transaction", transaction => {
	store.dispatch(addTransaction(transaction));
});

socket.on("sync", payload => {
	store.dispatch(syncWithNode(payload));
});

socket.on("all transactions", transactions => {
	console.log("all tx", transactions);
});

export default store;
