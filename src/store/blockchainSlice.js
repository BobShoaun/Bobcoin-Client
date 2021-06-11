import { createSlice } from "@reduxjs/toolkit";

import { addBlock as addBlockToBlockchain, createBlockchain } from "blockcrypto";

// import socket from "../socket";

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		chain: createBlockchain([]),
		fetched: false,
		network: "mainnet",
	},
	reducers: {
		newBlock: (state, { payload: { block, socket } }) => {
			addBlockToBlockchain(state.chain, block);
			socket.emit("block", block);
		},
		addBlock: (state, { payload: block }) => {
			addBlockToBlockchain(state.chain, block);
		},
		setBlockchain(state, { payload: blockchain }) {
			state.chain = createBlockchain(blockchain);
			state.fetched = true;
		},
		setNetwork(state, { payload: network }) {
			state.network = network;
		},
	},
});

export const { addBlock, newBlock, setBlockchain, setNetwork } = blockchainSlice.actions;
export default blockchainSlice.reducer;
