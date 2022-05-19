import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getParams = createAsyncThunk("consensus/getParams", async (payload, { getState }) => {
	const api = getState().network.api;
	const result = await axios.get(`${api}/consensus`);
	return result.data;
});

const initialState = {
	params: {},
	paramsLoaded: false,
};

const consensusSlice = createSlice({
	name: "consensus",
	initialState,
	reducers: {
		setParams(state, { payload: params }) {
			state.params = params;
			state.paramsLoaded = true;
		},
		reset: () => initialState,
	},
	extraReducers: {
		[getParams.pending]: state => {},
		[getParams.fulfilled]: (state, { payload }) => {
			state.fetched = true;
			state.params = payload;
		},
	},
});

export const { setParams, reset } = consensusSlice.actions;
export default consensusSlice.reducer;
