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
		resetTransactions: state => {
			state.txs = [];
			state.fetched = false;
		},
	},
});

export const { addTransaction, setTransactions, resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
