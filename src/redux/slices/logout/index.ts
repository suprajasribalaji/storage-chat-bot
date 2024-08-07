import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';

export const logout = createAsyncThunk(
  '/logout',
  async (_) => {
    await signOut(auth);
  }
);

const LogoutSlice = createSlice({
  name: 'logout',
  initialState: {
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default LogoutSlice.reducer;
