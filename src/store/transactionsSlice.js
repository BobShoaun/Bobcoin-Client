import { createSlice } from "@reduxjs/toolkit";
import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
} from "blockchain-crypto";

const transactionsSlice = createSlice({
	name: "transactions",
	initialState: [],
	reducers: {
		addTransactions: (state, { payload: transactions }) => {
			state.push(...transactions);
		},
	},
});

export const { addTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
