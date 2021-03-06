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
		externalKeys: JSON.parse(localStorage.getItem("external-keys")) ?? [],
		internalKeys: JSON.parse(localStorage.getItem("internal-keys")) ?? [],
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
			state.externalKeys = [];
			state.internalKeys = [];
			localStorage.removeItem("external-keys");
			localStorage.removeItem("internal-keys");
		},
		addExternalKeys(state, { payload: { sk, pk, addr, index } }) {
			state.externalKeys.push({ sk, pk, addr, index });
			localStorage.setItem("external-keys", JSON.stringify(state.externalKeys));
		},
		addInternalKeys(state, { payload: { sk, pk, addr, index } }) {
			state.internalKeys.push({ sk, pk, addr, index });
			localStorage.setItem("internal-keys", JSON.stringify(state.internalKeys));
		},
		deleteWallet(state) {
			localStorage.removeItem("mnemonic");
			localStorage.removeItem("xprv");
			localStorage.removeItem("xpub");
			localStorage.removeItem("external-keys");
			localStorage.removeItem("internal-keys");
			state.mnemonic = state.xprv = state.xpub = "";
			state.externalKeys = [];
			state.internalKeys = [];
		}
	},
});

export const { setKeys, setHdKeys, addExternalKeys, addInternalKeys, deleteWallet } = walletSlice.actions;
export default walletSlice.reducer;
