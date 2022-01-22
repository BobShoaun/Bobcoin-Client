import { setUnconfirmedBlocks, setMempool, setHeadBlock } from "../store/blockchainSlice";
import { setParams } from "../store/consensusSlice";

import store from "../store";

export const initializeSocket = socket => {
  socket.on("block", ({ headBlock, unconfirmedBlocks, mempool }) => {
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setUnconfirmedBlocks(unconfirmedBlocks));
    store.dispatch(setMempool(mempool));
    console.log("block", headBlock, unconfirmedBlocks);
  });
  socket.on("initialize", ({ params, headBlock, unconfirmedBlocks, mempool }) => {
    store.dispatch(setParams(params));
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setUnconfirmedBlocks(unconfirmedBlocks));
    store.dispatch(setMempool(mempool));
    console.log("init", params, headBlock, unconfirmedBlocks, mempool);
  });
  socket.on("mempool", ({ mempool }) => {
    store.dispatch(setMempool(mempool));
    console.log("mempool updated", mempool);
  });
  socket.on("test", args => {
    console.log("recieved test args", args);
  });
};
