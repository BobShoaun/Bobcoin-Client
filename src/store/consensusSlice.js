import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  params: null,
};

const consensusSlice = createSlice({
  name: "consensus",
  initialState,
  reducers: {
    setParams(state, { payload: params }) {
      state.params = params;
    },
    reset: () => initialState,
  },
});

export const { setParams, reset } = consensusSlice.actions;
export default consensusSlice.reducer;
