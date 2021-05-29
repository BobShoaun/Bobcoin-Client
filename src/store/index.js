import { configureStore } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchainSlice";
import transactionsReducer from "./transactionsSlice";

const store = configureStore({
	reducer: {
		blockchain: blockchainReducer,
		transactions: transactionsReducer,
	},
});

export default store;
