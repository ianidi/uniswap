import { createSlice } from "@reduxjs/toolkit";
import { getUnixTime } from "date-fns"
import { RootState } from "./";

interface IinitialState {
  rangeCheckbox: boolean
  wallet: string
  walletType: string
  timestampFrom: number
  timestampTo: number
}

const initialState: IinitialState = {
  rangeCheckbox: false,
  wallet: "", //0xe592427a0aece92de3edee1f18e0157c05861564
  walletType: "sender",
  timestampFrom: 0,
  timestampTo: getUnixTime((new Date())),
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
    setWalletType: (state, action) => {
      state.walletType = action.payload;
    },
    setTimestampFrom: (state, action) => {
      state.timestampFrom = action.payload;
    },
    setTimestampTo: (state, action) => {
      state.timestampTo = action.payload;
    },
  }
});

export const { setRangeCheckbox, setWallet, setWalletType, setTimestampFrom, setTimestampTo } = appSlice.actions;

export const selectRangeCheckbox = (state: RootState) => state.app.rangeCheckbox;
export const selectWallet = (state: RootState) => state.app.wallet;
export const selectWalletType = (state: RootState) => state.app.walletType;
export const selectTimestampFrom = (state: RootState) => state.app.timestampFrom;
export const selectTimestampTo = (state: RootState) => state.app.timestampTo;

export default appSlice.reducer;
