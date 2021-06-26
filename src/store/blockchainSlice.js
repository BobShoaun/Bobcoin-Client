import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { bobcoinMainnet, bobcoinTestnet } from "../config";

import { addBlock as addBlockToBlockchain, createBlockchain } from "blockcrypto";
import axios from "axios";

export const getBlockchain = createAsyncThunk(
	"blockchain/getBlockchain",
	async (payload, { getState }) => {
		const network = getState().blockchain.network;
		const blockchain = getState().blockchain.chain;
		let params = "";
		if (blockchain.length) {
			const { block } = blockchain[blockchain.length - 1];
			params = `&height=${block.height}&timestamp=${block.timestamp}`;
		}
		const api = network === "mainnet" ? bobcoinMainnet : bobcoinTestnet;
		const result = await axios.get(`${api}/blockchain/info?limit=10${params}`);
		return result.data;
	}
);

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		chain: [],
		fetched: false,
		network: localStorage.getItem("network") ?? "mainnet",
		api: "http://localhost:3001",
	},
	reducers: {
		addBlock: (state, { payload: block }) => {
			state.chain.unshift(block);
		},
		// setBlockchain(state, { payload: blockchain }) {
		// 	state.chain = createBlockchain(blockchain);
		// 	state.fetched = true;
		// },
		setNetwork(state, { payload: network }) {
			state.network = network;
			localStorage.setItem("network", network);
		},
		resetBlockchain: state => {
			state.chain = [];
			state.fetched = false;
		},
	},
	extraReducers: {
		[getBlockchain.fulfilled]: (state, { payload }) => {
			console.log("chain: ", payload);
			state.chain.push(...payload);
		},
	},
});

export const { addBlock, setBlockchain, setNetwork, resetBlockchain } = blockchainSlice.actions;
export default blockchainSlice.reducer;
