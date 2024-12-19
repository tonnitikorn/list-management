import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slice/boardSlice';
import registerFormReducer from './slice/registerFormSlice';
import signInReducer from './slice/signInSlice';


export const store = configureStore({
  reducer: {
    registerForm: registerFormReducer,
    board: boardReducer,
    signInForm: signInReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
