import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getParams = createAsyncThunk("consensus/getParams", async (payload, { getState }) => {
	const api = getState().network.api;
	const result = await axios.get(`${api}/consensus`);
	return result.data;
});

const consensusSlice = createSlice({
	name: "consensus",
	initialState: {
		params: {},
		fetched: false,
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
		[getParams.pending]: state => {},
		[getParams.fulfilled]: (state, { payload }) => {
			state.fetched = true;
			state.params = payload;
		},
	},
});

export const { setParams, resetParams } = consensusSlice.actions;
export default consensusSlice.reducer;
