import { createSlice } from "@reduxjs/toolkit";

import { addBlockToBlockchain, createBlockchain } from "blockchain-crypto";

import socket from "./socket";

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		params: {
			name: "Bobcoin",
			symbol: "BBC", // or BCX ?
			coin: 100000000, // amounts are stored as the smallest unit, this is how many of the smallest unit that amounts to 1 coin.
			version: 1,
			addressPre: "06",
			checksumLen: 4,
			initBlkReward: 5000000005, // in coins
			blkRewardHalflife: 10, // in block height
			initBlockDiff: 1,
			initHashTarg: "0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
			targBlkTime: 5 * 60, // 5 minutes in seconds
			diffRecalcHeight: 20, // in block height
			minDiffCorrFact: 1 / 4,
			maxDiffCorrFact: 4,
		},
		chain: createBlockchain([]),
	},
	reducers: {
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

export const { addBlock, newBlock } = blockchainSlice.actions;

export default blockchainSlice.reducer;
