import { createSlice } from "@reduxjs/toolkit";

import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
} from "blockchain-crypto";

import socket from "./socket";

const pk = "21mm3w2KGGbya45eJ9DzezFBJYgaZoyQ8mw5pe3dDpwzZ";
// sk: bob

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: [mineGenesisBlock(pk)],
	reducers: {
		initialize: state => {
			resetCache();
			const genesis = mineGenesisBlock(pk);
			state = createBlockchain([genesis]);
		},
		newBlock: (state, { payload: block }) => {
			addBlockToBlockchain(state, block);
			socket.emit("new block", block);
		},
		addBlock: (state, { payload: block }) => {
			console.log("received block:", block);
			addBlockToBlockchain(state, block);
		},
	},
});

export const { initialize, addBlock, newBlock } = blockchainSlice.actions;

export default blockchainSlice.reducer;
