import { createSlice } from '@reduxjs/toolkit';
import { langStateType } from 'types';

const initialState: langStateType = {
  lang: 'en',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
