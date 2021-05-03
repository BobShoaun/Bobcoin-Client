import { configureStore } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchainSlice";
import transactionsReducer from "./transactionsSlice";

export default configureStore({
	reducer: {
		blockchain: blockchainReducer,
		transactions: transactionsReducer,
	},
});
