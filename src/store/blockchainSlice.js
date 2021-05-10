import { createSlice } from "@reduxjs/toolkit";

import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
} from "blockchain-crypto";

import socket from "./socket";

const pk =
	"04d5db8b8c280e9914f0a034ac3e0f9fcf169f20464a618789994f8a796663c3e241163c3a085a0039f5e5635a819941f798f27078aa65ecbbeb60d577c263412b";
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
