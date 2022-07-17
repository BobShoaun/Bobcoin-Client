import { createSlice } from "@reduxjs/toolkit";
import { nodes } from "../config";

const nodeName = localStorage.getItem("network-name") ?? nodes[0].name;
const nodeUrl = localStorage.getItem("network-url") ?? nodes[0].url;
const showMiningPopup = (localStorage.getItem("mining-popup") ?? "true") == "true";

const networkSlice = createSlice({
  name: "network",
  initialState: {
    nodeName,
    nodeUrl,
    showMiningPopup,
  },
  reducers: {
    setNetwork(state, { payload: { nodeName, nodeUrl } }) {
      state.nodeName = nodeName;
      state.nodeUrl = nodeUrl;
      localStorage.setItem("network-name", nodeName);
      localStorage.setItem("network-url", nodeUrl);
    },
    setMiningPopup(state, { payload: showMiningPopup }) {
      state.showMiningPopup = showMiningPopup;
      localStorage.setItem("mining-popup", showMiningPopup);
    },
  },
});

export const { setNetwork, setMiningPopup } = networkSlice.actions;
export default networkSlice.reducer;
