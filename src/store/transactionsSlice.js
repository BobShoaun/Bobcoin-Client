import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
	name: "transactions",
	initialState: {
		txs: [],
		fetched: false,
	},
	reducers: {
		addTransaction(state, { payload: transaction }) {
			state.txs.push(transaction);
		},
		setTransactions(state, { payload: transactions }) {
			state.txs = transactions;
			state.fetched = true;
		},
	},
});

export const { addTransaction, setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
