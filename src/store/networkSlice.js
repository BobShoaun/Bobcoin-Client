import { createSlice } from "@reduxjs/toolkit";
import { nodes } from "../config";

if (!["other", ...nodes.map(node => node.name)].includes(localStorage.getItem("network-name")))
  localStorage.removeItem("network-name");

const nodeName = localStorage.getItem("network-name") ?? nodes[0].name;
const nodeUrl = localStorage.getItem("network-url") ?? nodes[0].url;
const showMiningPopup = (localStorage.getItem("mining-popup") ?? "true") === "true";
const apiToken = localStorage.getItem("api-token") ?? "";

const networkSlice = createSlice({
  name: "network",
  initialState: {
    nodeName,
    nodeUrl,
    showMiningPopup,
    apiToken,
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
    setApiToken(state, { payload: apiToken }) {
      state.apiToken = apiToken;
      localStorage.setItem("api-token", apiToken);
    },
  },
});

export const { setNetwork, setMiningPopup, setApiToken } = networkSlice.actions;
export default networkSlice.reducer;
