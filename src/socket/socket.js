import { setMempool, setHeadBlock } from "../store/blockchainSlice";
import { setParams } from "../store/consensusSlice";

import store from "../store";

export const initializeSocket = socket => {
  socket.on("initialize", ({ params, headBlock, mempool }) => {
    store.dispatch(setParams(params));
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setMempool(mempool));
    console.log("initialize", { params, headBlock, mempool });
  });
  socket.on("block", ({ headBlock, mempool }) => {
    store.dispatch(setHeadBlock(headBlock));
    store.dispatch(setMempool(mempool));
    console.log("new block", { headBlock, mempool });
  });
  socket.on("mempool", ({ mempool }) => {
    store.dispatch(setMempool(mempool));
    console.log("mempool updated", mempool);
  });
};
