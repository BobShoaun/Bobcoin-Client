import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
	name: "wallet",
	initialState: {
		keys: {
			sk: localStorage.getItem("secret-key"),
			pk: localStorage.getItem("public-key"),
			address: localStorage.getItem("address"),
		},
	},
	reducers: {
		setKeys(state, { payload: keys }) {
			state.keys = keys;
			localStorage.setItem("secret-key", keys.sk);
			localStorage.setItem("public-key", keys.pk);
			localStorage.setItem("address", keys.address);
		},
	},
});

export const { setKeys } = walletSlice.actions;
export default walletSlice.reducer;
