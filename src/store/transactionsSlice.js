import { createSlice } from "@reduxjs/toolkit";
import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
} from "blockchain-crypto";

export const transactionsSlice = createSlice({
	name: "transactions",
	initialState: [],
	reducers: {
		addTransactions: (state, transactions) => {
			console.log(transactions);
			state.push(...transactions);
		},
	},
});

export const { addTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
