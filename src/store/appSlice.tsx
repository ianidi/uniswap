import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./";

interface initialState {
  token: string
}

const initialState: initialState = {
  token: "0",
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  }
});

export const {
  setToken,
} = appSlice.actions;

export const selectToken = (state: RootState) => state.app.token;

export default appSlice.reducer;
