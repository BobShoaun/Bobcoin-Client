/* global BigInt */

// import { createSlice } from "@reduxjs/toolkit";

// const paramsSlice = createSlice({
// 	name: "params",
// 	initialState: [mineGenesisBlock(pk)],
// 	reducers: {
// 		initialize: state => {
// 			resetCache();
// 			const genesis = mineGenesisBlock(pk);
// 			state = createBlockchain([genesis]);
// 		},
// 		newBlock: (state, { payload: block }) => {
// 			addBlockToBlockchain(state, block);

// 			socket.emit("new block", block);
// 		},
// 		addBlock: (state, { payload: block }) => {
// 			console.log("received block:", block);
// 			addBlockToBlockchain(state, block);
// 		},
// 	},
// });

// export const { initialize, addBlock, newBlock } = paramsSlice.actions;

// export default paramsSlice.reducer;
