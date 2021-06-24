import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { bobcoinMainnet, bobcoinTestnet } from "../config";
import axios from "axios";

export const getParams = createAsyncThunk("consensus/getParams", async (payload, { getState }) => {
	const network = getState().blockchain.network;
	const result = await axios.get(
		`${network === "mainnet" ? bobcoinMainnet : bobcoinTestnet}/consensus`
	);
	return result.data;
});

const consensusSlice = createSlice({
	name: "consensus",
	initialState: {
		params: {},
		fetched: false,
		status: null,
	},
	reducers: {
		setParams(state, { payload: params }) {
			state.params = params;
			state.fetched = true;
		},
		resetParams: state => {
			state.params = {};
			state.fetched = false;
		},
	},
	extraReducers: {
		[getParams.pending]: state => {
			state.status = "loading";
		},
		[getParams.fulfilled]: (state, { payload }) => {
			state.status = "success";
			state.fetched = true;
			state.params = payload;
			console.log("params: ", payload);
		},
	},
});

export const { setParams, resetParams } = consensusSlice.actions;
export default consensusSlice.reducer;
