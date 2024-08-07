import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';

interface LoginPayload {
    email: string
    password: string
}

export const login = createAsyncThunk<void, LoginPayload>(
  '/login',
  async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
  }
);

const LoginSlice = createSlice({
  name: 'login',
  initialState: {
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default LoginSlice.reducer;
