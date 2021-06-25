import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./";

interface IinitialState {
  rangeCheckbox: boolean
  wallet: string
}

const initialState: IinitialState = {
  rangeCheckbox: false,
  wallet: "0xe592427a0aece92de3edee1f18e0157c05861564"
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRangeCheckbox: (state, action) => {
      state.rangeCheckbox = action.payload;
    },
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
  }
});

export const { setRangeCheckbox, setWallet } = appSlice.actions;

export const selectRangeCheckbox = (state: RootState) => state.app.rangeCheckbox;
export const selectWallet = (state: RootState) => state.app.wallet;

export default appSlice.reducer;
