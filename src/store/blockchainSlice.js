import { createSlice } from "@reduxjs/toolkit";

import { addBlockToBlockchain, createBlockchain } from "blockcrypto";

import socket from "../socket";

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		params: {},
		chain: createBlockchain([]),
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
		},
		setParams(state, { payload: params }) {
			state.params = params;
		},
	},
});

export const { addBlock, newBlock, setBlockchain, setParams } = blockchainSlice.actions;

export default blockchainSlice.reducer;
