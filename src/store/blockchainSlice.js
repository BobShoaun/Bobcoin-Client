/* global BigInt */
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
	initialState: {
		params: {
			name: "Bobcoin",
			symbol: "BBC", // or BCX ?
			coin: 100000000, // amounts are stored as the smallest unit, this is how many of the smallest unit that amounts to 1 coin.
			initBlockReward: 50, // in coins
			blockRewardHalflife: 10, // in block height
			initBlockDiff: 1,
			initHashTarget: "0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
			targetBlockTime: 5 * 60, // 5 minutes in seconds
			diffRecalcHeight: 20, // in block height
			minDiffCorrectionFactor: 1 / 4,
			maxDiffCorrectionFactor: 4,
		},
		chain: [],
	},
	reducers: {
		initialize: state => {
			resetCache();
			console.log(state);

			const genesis = mineGenesisBlock(state.params, pk);
			state.chain = createBlockchain([genesis]);
		},
		newBlock: (state, { payload: block }) => {
			addBlockToBlockchain(state.chain, block);

			socket.emit("new block", block);
		},
		addBlock: (state, { payload: block }) => {
			console.log("received block:", block);
			addBlockToBlockchain(state.chain, block);
		},
	},
});

export const { initialize, addBlock, newBlock } = blockchainSlice.actions;

export default blockchainSlice.reducer;
