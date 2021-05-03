import { createSlice } from "@reduxjs/toolkit";
import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
} from "blockchain-crypto";

export const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: [mineGenesisBlock("genesis")],
	reducers: {
		initialize: state => {
			resetCache();
			const genesis = mineGenesisBlock("genesis");
			state = createBlockchain([genesis]);
		},
		addBlock: (state, { payload }) => {
			addBlockToBlockchain(state, payload.block);
		},
	},
});

export const { initialize, addBlock } = blockchainSlice.actions;

export default blockchainSlice.reducer;
