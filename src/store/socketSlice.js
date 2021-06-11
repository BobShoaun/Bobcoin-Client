// import { createSlice } from "@reduxjs/toolkit";

// import io from "socket.io-client";
// import { bobcoinMainnet, bobcoinTestnet } from "../config";

// const socketSlice = createSlice({
// 	name: "socket",
// 	initialState: {
// 		socket: null,
// 		network: "mainnet",
// 	},
// 	reducers: {
// 		setNetwork(state, { payload: { network } }) {
// 			state.network = network;
// 			state.socket = io(network === "mainnet" ? bobcoinMainnet : bobcoinTestnet);
// 			console.log(state.socket);
// 		},
// 	},
// });

// export const { setNetwork } = socketSlice.actions;
// export default socketSlice.reducer;
