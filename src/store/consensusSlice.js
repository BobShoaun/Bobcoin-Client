import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  params: {},
  paramsLoaded: false,
};

const consensusSlice = createSlice({
  name: "consensus",
  initialState,
  reducers: {
    setParams(state, { payload: params }) {
      state.params = params;
      state.paramsLoaded = true;
    },
    reset: () => initialState,
  },
});

export const { setParams, reset } = consensusSlice.actions;
export default consensusSlice.reducer;
