import { createSlice } from '@reduxjs/toolkit';
import { recordsStateType } from 'types';

const initialState: recordsStateType = {
  csv_data: null,
  isTablePretty: false,
  addSingleData: null,
};

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setCSVData: (state, action) => {
      state.csv_data = action.payload;
    },
    setIsTablePretty: (state, action) => {
      state.isTablePretty = action.payload;
    },
    clearCSVData: (state) => {
      state.csv_data = null;
    },
    setAddSingleData: (state, action) => {
      state.addSingleData = action.payload;
    },
  },
});

export const { setCSVData, setIsTablePretty, clearCSVData, setAddSingleData } =
  recordsSlice.actions;

export default recordsSlice.reducer;
