import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import recordsReducer from './recordsSlice';
import userReducer from './userSlice';
import unionsReducer from './unionsSlice';

export const store = configureStore({
  reducer: {
    records: recordsReducer,
    user: userReducer,
    language: languageReducer,
    unions: unionsReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
});
