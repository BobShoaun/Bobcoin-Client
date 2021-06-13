import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setParams, resetParams } = consensusSlice.actions;
export default consensusSlice.reducer;
