import { addBlock, setBlockchain } from "../store/blockchainSlice";
import { setParams } from "../store/consensusSlice";
import { addTransaction, setTransactions } from "../store/transactionsSlice";

import store from "../store";

export const initializeSocket = socket => {
	socket.on("block", block => {
		store.dispatch(addBlock(block));
	});

	socket.on("transaction", transaction => {
		store.dispatch(addTransaction(transaction));
	});

	socket.on("blockchain", blockchain => {
		store.dispatch(setBlockchain(blockchain));
		console.log("blockchain: ", blockchain);
	});

	// socket.on("params", params => {
	// 	store.dispatch(setParams(params));
	// 	console.log("params: ", params);
	// });

	socket.on("transactions", transactions => {
		store.dispatch(setTransactions(transactions));
		console.log("transactions: ", transactions);
	});
};
