import { createSlice } from "@reduxjs/toolkit";
import { bobcoinMainnet, bobcoinTestnet } from "../config";

const network = localStorage.getItem("network") ?? "mainnet";

const networkSlice = createSlice({
	name: "network",
	initialState: {
		network,
		api: network === "mainnet" ? bobcoinMainnet : bobcoinTestnet,
	},
	reducers: {
		setNetwork(state, { payload: network }) {
			localStorage.setItem("network", network);
			state.network = network;
			state.api = network === "mainnet" ? bobcoinMainnet : bobcoinTestnet;
		},
	},
});

export const { setNetwork } = networkSlice.actions;
export default networkSlice.reducer;
