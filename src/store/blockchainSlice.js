import { createSlice } from "@reduxjs/toolkit";

import { addBlockToBlockchain, createBlockchain } from "blockcrypto";

import socket from "../socket";

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		chain: createBlockchain([]),
		fetched: false,
	},
	reducers: {
		newBlock: (state, { payload: block }) => {
			addBlockToBlockchain(state.chain, block);
			socket.emit("block", block);
		},
		addBlock: (state, { payload: block }) => {
			console.log("received block:", block);
			addBlockToBlockchain(state.chain, block);
		},
		setBlockchain(state, { payload: blockchain }) {
			state.chain = createBlockchain(blockchain);
			state.fetched = true;
		},
	},
});

export const { addBlock, newBlock, setBlockchain } = blockchainSlice.actions;
export default blockchainSlice.reducer;
