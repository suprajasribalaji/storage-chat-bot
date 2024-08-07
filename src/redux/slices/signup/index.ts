import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';

interface SignupPayload {
  email: string;
  password: string;
}

export const signup = createAsyncThunk<void, SignupPayload>(
  '/signup',
  async ({ email, password }) => {
    await createUserWithEmailAndPassword(auth, email, password);
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default signupSlice.reducer;
