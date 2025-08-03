import { createSlice } from '@reduxjs/toolkit';
import { userStateType } from 'types';

const initialState: userStateType = {
  token: null,
  userData: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.token = action.payload?.attributes?.token ?? null;
    },
  },
});

export const { setUserToken, setUserData } = userSlice.actions;

export default userSlice.reducer;
