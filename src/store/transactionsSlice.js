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
		addTransactions: (state, { payload }) => {
			state.push(...payload.transactions);
		},
	},
});

export const { addTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
