import { configureStore } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchainSlice";
import consensusReducer from "./consensusSlice";
import walletReducer from "./walletSlice";
import networkReducer from "./networkSlice";

const store = configureStore({
	reducer: {
		blockchain: blockchainReducer,
		consensus: consensusReducer,
		wallet: walletReducer,
		network: networkReducer,
	},
});

export default store;
