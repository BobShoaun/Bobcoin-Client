import { createSlice } from "@reduxjs/toolkit";

import socket from "../socket";

const transactionsSlice = createSlice({
	name: "transactions",
	initialState: {
		txs: [],
		fetched: false,
	},
	reducers: {
		newTransaction(state, { payload: transaction }) {
			state.txs.push(transaction);
			socket.emit("transaction", transaction);
		},
		addTransaction(state, { payload: transaction }) {
			state.txs.push(transaction);
		},
		setTransactions(state, { payload: transactions }) {
			state.txs = transactions;
			state.fetched = true;
		},
	},
});

export const { newTransaction, addTransaction, setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
