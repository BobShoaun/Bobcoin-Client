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
	},
});

export const { setParams } = consensusSlice.actions;
export default consensusSlice.reducer;
