import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./";

interface IinitialState {
  loading: boolean
  data: any
}

const initialState: IinitialState = {
  loading: false,
  data: []
}

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  }
});

export const { setLoading } = dataSlice.actions;
export const { setData } = dataSlice.actions;

export const selectLoading = (state: RootState) => state.data.loading;
export const selectData = (state: RootState) => state.data.data;

export default dataSlice.reducer;