import { createSlice } from "@reduxjs/toolkit";
import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
} from "blockchain-crypto";

import socket from "./socket";

const transactionsSlice = createSlice({
	name: "transactions",
	initialState: [],
	reducers: {
		newTransaction: (state, { payload: transaction }) => {
			state.push(transaction);
			socket.emit("new transaction", transaction);
		},
		addTransaction: (state, { payload: transaction }) => {
			console.log("received transaction:", transaction);
			state.push(transaction);
		},
	},
});

export const { newTransaction, addTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
