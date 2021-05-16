/* global BigInt */
import { createSlice } from "@reduxjs/toolkit";

import {
	mineGenesisBlock,
	createBlockchain,
	resetCache,
	addBlockToBlockchain,
	setParameters,
} from "blockchain-crypto";

import socket from "./socket";

const pk = "21mm3w2KGGbya45eJ9DzezFBJYgaZoyQ8mw5pe3dDpwzZ";
// sk: bob

let parameters = {
	name: "Bobcoin",
	symbol: "BBC", // or BCX ?
	coin: 100000000, // amounts are stored as the smallest unit, this is how many of the smallest unit that amounts to 1 coin.
	initialBlockReward: 50, // in coins
	blockRewardHalflife: 10, // in block height
	initialBlockDifficulty: 1,
	initialHashTarget: BigInt("0x0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
	targetBlockTime: 5 * 60, // 5 minutes in seconds
	difficultyRecalcHeight: 20, // in block height
};

setParameters(parameters);
console.log("params set: ", parameters);

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
