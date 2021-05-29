import { addBlock, setBlockchain, setParams } from "../store/blockchainSlice";
import { addTransaction, setTransactions } from "../store/transactionsSlice";

import store from "../store";
import socket from "./index";

export const initializeSocket = () => {
	socket.on("block", block => {
		store.dispatch(addBlock(block));
	});

	socket.on("transaction", transaction => {
		store.dispatch(addTransaction(transaction));
	});

	socket.on("blockchain", blockchain => {
		store.dispatch(setBlockchain(blockchain));
	});

	socket.on("params", params => {
		store.dispatch(setParams(params));
	});

	socket.on("transactions", transactions => {
		store.dispatch(setTransactions(transactions));
	});
};
