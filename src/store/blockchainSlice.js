import { createSlice } from "@reduxjs/toolkit";

import { addBlock as addBlockToBlockchain, createBlockchain } from "blockcrypto";

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		chain: [],
		fetched: false,
		network: localStorage.getItem("network") ?? "mainnet",
	},
	reducers: {
		addBlock: (state, { payload: block }) => {
			addBlockToBlockchain(state.chain, block);
		},
		setBlockchain(state, { payload: blockchain }) {
			state.chain = createBlockchain(blockchain);
			state.fetched = true;
		},
		setNetwork(state, { payload: network }) {
			state.network = network;
			localStorage.setItem("network", network);
		},
		resetBlockchain: state => {
			state.chain = [];
			state.fetched = false;
		},
	},
});

export const { addBlock, setBlockchain, setNetwork, resetBlockchain } = blockchainSlice.actions;
export default blockchainSlice.reducer;
