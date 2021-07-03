import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getBlockchain = createAsyncThunk(
	"blockchain/getBlockchain",
	async (payload, { getState }) => {
		const blockchain = getState().blockchain.chain;
		let params = "";
		if (blockchain.length) {
			const { block } = blockchain[blockchain.length - 1];
			params = `&height=${block.height}&timestamp=${block.timestamp}`;
		}
		const api = getState().network.api;
		const result = await axios.get(`${api}/blockchain/info?limit=10${params}`);
		return result.data;
	}
);

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState: {
		chain: [],
		fetched: false,
		status: "idle",
	},
	reducers: {
		addBlock: (state, { payload: block }) => {
			state.chain.unshift(block);
		},
		resetBlockchain: state => {
			state.chain = [];
			state.fetched = false;
			state.status = "idle";
		},
	},
	extraReducers: {
		[getBlockchain.pending]: state => {
			state.status = "loading";
		},
		[getBlockchain.fulfilled]: (state, { payload }) => {
			state.status = "success";
			state.chain.push(...payload);
		},
	},
});

export const { addBlock, resetBlockchain } = blockchainSlice.actions;
export default blockchainSlice.reducer;
