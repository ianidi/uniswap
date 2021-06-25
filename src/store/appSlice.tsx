import { createSlice } from "@reduxjs/toolkit";
import { getUnixTime } from "date-fns"
import { RootState } from "./";

interface IinitialState {
  rangeCheckbox: boolean
  wallet: string
  walletType: string
  timestampFrom: number
  timestampTo: number
  items: number
  offset: number
}

const initialState: IinitialState = {
  rangeCheckbox: false,
  wallet: "", //0xe592427a0aece92de3edee1f18e0157c05861564
  walletType: "sender",
  timestampFrom: 0,
  timestampTo: getUnixTime((new Date())),
  items: 200,
  offset: 0,
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
    setItems: (state, action) => {
      state.offset = 0;
      state.items = Number(action.payload);
    },
    prevOffset: (state) => {
      if (state.offset > state.items) {
        state.offset -= state.items;
      } else {
        state.offset = 0;
      }
    },
    nextOffset: (state) => {
      state.offset += state.items;
    },
  }
});

export const { setRangeCheckbox, setWallet, setWalletType, setTimestampFrom, setTimestampTo, setItems, prevOffset, nextOffset } = appSlice.actions;

export const selectRangeCheckbox = (state: RootState) => state.app.rangeCheckbox;
export const selectWallet = (state: RootState) => state.app.wallet;
export const selectWalletType = (state: RootState) => state.app.walletType;
export const selectTimestampFrom = (state: RootState) => state.app.rangeCheckbox ? state.app.timestampFrom : 0;
export const selectTimestampTo = (state: RootState) => state.app.rangeCheckbox ? state.app.timestampTo : getUnixTime((new Date()));
export const selectItems = (state: RootState) => state.app.items;
export const selectOffset = (state: RootState) => state.app.offset;

export default appSlice.reducer;