import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headBlock: null,
  headBlockLoaded: false,
  mempool: null,
  mempoolLoaded: false,
};

const blockchainSlice = createSlice({
  name: "blockchain",
  initialState,
  reducers: {
    setMempool: (state, { payload: mempool }) => {
      state.mempool = mempool;
      state.mempoolLoaded = true;
    },
    setHeadBlock: (state, { payload: headBlock }) => {
      state.headBlock = headBlock;
      state.headBlockLoaded = true;
    },
    reset: () => initialState,
  },
});

export const { reset, setMempool, setHeadBlock } = blockchainSlice.actions;
export default blockchainSlice.reducer;
