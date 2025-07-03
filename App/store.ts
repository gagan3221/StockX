import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import { DefaultRootState } from 'react-redux';

const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

declare module 'react-redux' {
  interface DefaultRootState extends ReturnType<typeof store.getState> {}
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 