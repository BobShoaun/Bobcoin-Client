import {  setMempool, setHeadBlock, setRecentBlocks } from "../store/blockchainSlice";
import { setParams } from "../store/consensusSlice";

import store from "../store";

export const initializeSocket = socket => {
  socket.on("block", ({ headBlock, recentBlocks, mempool }) => {
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setRecentBlocks(recentBlocks));
    store.dispatch(setMempool(mempool));
    console.log("block", { headBlock, recentBlocks, mempool });
  });
  socket.on("initialize", ({ params, headBlock, recentBlocks, mempool }) => {
    store.dispatch(setParams(params));
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setRecentBlocks(recentBlocks));
    store.dispatch(setMempool(mempool));
    console.log("init", { params, headBlock, recentBlocks, mempool });
  });
  socket.on("mempool", ({ mempool }) => {
    store.dispatch(setMempool(mempool));
    console.log("mempool updated", mempool);
  });
  socket.on("test", args => {
    console.log("recieved test args", args);
  });
};
