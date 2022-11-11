import { createSlice } from "@reduxjs/toolkit";

// for backwards compatibility, remove in the future
const internalKeys = JSON.parse(localStorage.getItem("internal-keys"));
if (internalKeys?.[0]?.sk) {
  // using old format, convert to new
  localStorage.setItem(
    "internal-keys",
    JSON.stringify(internalKeys.map(k => ({ secretKey: k.sk, publicKey: k.pk, address: k.addr, index: k.index })))
  );
}

const externalKeys = JSON.parse(localStorage.getItem("external-keys"));
if (externalKeys?.[0]?.sk) {
  // using old format, convert to new
  localStorage.setItem(
    "external-keys",
    JSON.stringify(externalKeys.map(k => ({ secretKey: k.sk, publicKey: k.pk, address: k.addr, index: k.index })))
  );
}

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    keys: {
      secretKey: localStorage.getItem("secret-key"),
      publicKey: localStorage.getItem("public-key"),
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
      localStorage.setItem("secret-key", keys.secretKey);
      localStorage.setItem("public-key", keys.publicKey);
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
    addExternalKeys(state, { payload: { secretKey, publicKey, address, index } }) {
      state.externalKeys.push({ secretKey, publicKey, address, index });
      localStorage.setItem("external-keys", JSON.stringify(state.externalKeys));
    },
    addInternalKeys(state, { payload: { secretKey, publicKey, address, index } }) {
      state.internalKeys.push({ secretKey, publicKey, address, index });
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
    },
  },
});

export const { setKeys, setHdKeys, addExternalKeys, addInternalKeys, deleteWallet } = walletSlice.actions;
export default walletSlice.reducer;
