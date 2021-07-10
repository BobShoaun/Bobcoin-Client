import { setUnconfirmedBlocks, setMempool, setHeadBlock } from "../store/blockchainSlice";

import store from "../store";

export const initializeSocket = socket => {
	socket.on("block", ({ unconfirmedBlocks, mempool, headBlock }) => {
		console.log("incoming");
		store.dispatch(setUnconfirmedBlocks(unconfirmedBlocks));
		store.dispatch(setMempool(mempool));
		store.dispatch(setHeadBlock(headBlock));
	});
};
