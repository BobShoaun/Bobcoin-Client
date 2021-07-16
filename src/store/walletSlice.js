import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
	name: "wallet",
	initialState: {
		keys: {
			sk: localStorage.getItem("secret-key"),
			pk: localStorage.getItem("public-key"),
			address: localStorage.getItem("address"),
		},
		mnemonic: localStorage.getItem("mnemonic"),
		xprv: localStorage.getItem("xprv"),
		xpub: localStorage.getItem("xpub"),
		externalKeys: [],
		internalKeys: [],
	},
	reducers: {
		setKeys(state, { payload: keys }) {
			state.keys = keys;
			localStorage.setItem("secret-key", keys.sk);
			localStorage.setItem("public-key", keys.pk);
			localStorage.setItem("address", keys.address);
		},
		setHdKeys(state, { payload: hdKeys }) {
			state.mnemonic = hdKeys.mnemonic;
			state.xprv = hdKeys.xprv;
			state.xpub = hdKeys.xpub;
			localStorage.setItem("mnemonic", hdKeys.mnemonic);
			localStorage.setItem("xprv", hdKeys.xprv);
			localStorage.setItem("xpub", hdKeys.xpub);
		},
		addExternalKeys(state, { payload: { sk, pk, addr, index } }) {
			state.externalKeys.push({ sk, pk, addr, index });
		},
		addInternalKeys(state, { payload: { sk, pk, addr, index } }) {
			state.internalKeys.push({ sk, pk, addr, index });
		},
	},
});

export const { setKeys, setHdKeys, addExternalKeys, addInternalKeys } = walletSlice.actions;
export default walletSlice.reducer;
