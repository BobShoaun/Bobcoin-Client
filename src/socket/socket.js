import { setMempool, setHeadBlock, setRecentValidBlocks } from "../store/blockchainSlice";
import { setParams } from "../store/consensusSlice";

import store from "../store";

export const initializeSocket = socket => {
  socket.on("initialize", ({ params, headBlock, recentValidBlocks, mempool }) => {
    store.dispatch(setParams(params));
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setRecentValidBlocks(recentValidBlocks));
    store.dispatch(setMempool(mempool));
    console.log("initialize", { params, recentValidBlocks, mempool });
  });
  socket.on("block", ({ headBlock, recentValidBlocks, mempool }) => {
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setRecentValidBlocks(recentValidBlocks));
    store.dispatch(setMempool(mempool));
    console.log("new block", { recentValidBlocks, mempool });
  });
  socket.on("mempool", ({ mempool }) => {
    store.dispatch(setMempool(mempool));
    console.log("mempool updated", mempool);
  });
};
