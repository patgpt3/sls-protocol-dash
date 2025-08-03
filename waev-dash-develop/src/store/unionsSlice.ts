import { createSlice } from '@reduxjs/toolkit';
import { unionsStateType } from 'types';

const initialState: unionsStateType = {
  selected_union: null,
};

export const unionsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setSelectedUnion: (state, action) => {
      state.selected_union = action.payload;
    },
    clearSelectedUnion: (state) => {
      state.selected_union = null;
    },
  },
});

export const { setSelectedUnion, clearSelectedUnion } = unionsSlice.actions;

export default unionsSlice.reducer;
