import { createSlice } from "@reduxjs/toolkit";

// import { setNetwork } from "./socketSlice";
// import socket from "../socket";

// export const newTransaction = createAsyncThunk(
// 	"transactions/newTransaction",
// 	async (payload, { dispatch, getState }) => {
// 		console.log(payload, getState());
// 		dispatch(setNetwork({ network: "mainnet" }));
// 		// return "hello";
// 	}
// );

const transactionsSlice = createSlice({
	name: "transactions",
	initialState: {
		txs: [],
		fetched: false,
	},
	reducers: {
		newTransaction(state, { payload: { transaction, socket } }) {
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

export const { addTransaction, setTransactions, newTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
