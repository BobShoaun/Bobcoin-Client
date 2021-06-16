import { configureStore } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchainSlice";
import transactionsReducer from "./transactionsSlice";
import consensusReducer from "./consensusSlice";
import walletReducer from "./walletSlice";

const store = configureStore({
	reducer: {
		blockchain: blockchainReducer,
		transactions: transactionsReducer,
		consensus: consensusReducer,
		wallet: walletReducer,
	},
});

export default store;
