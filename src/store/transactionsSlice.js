import { createSlice } from "@reduxjs/toolkit";

import socket from "../socket";

const transactionsSlice = createSlice({
	name: "transactions",
	initialState: [],
	reducers: {
		newTransaction(state, { payload: transaction }) {
			state.push(transaction);
			socket.emit("transaction", transaction);
		},
		addTransaction(state, { payload: transaction }) {
			console.log("received transaction:", transaction);
			state.push(transaction);
		},
		setTransactions(state, { payload: transactions }) {
			state.push(...transactions);
			console.log("all tx", state);
		},
	},
});

export const { newTransaction, addTransaction, setTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
