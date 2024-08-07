import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';
import { setCurrentUser, setLoading } from '.';

export const ListenToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (_, thunkAPI) => {
    return new Promise<void>((resolve) => {
      thunkAPI.dispatch(setLoading(true));
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const { uid, email } = user;
          thunkAPI.dispatch(setCurrentUser({ uid, email }));
        } else {
          thunkAPI.dispatch(setCurrentUser(null));
        }
        thunkAPI.dispatch(setLoading(false));
        resolve();
      });
    });
  }
);

const AuthListenerSlice = createSlice({
  name: 'authListener',
  initialState: {
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ListenToAuthChanges.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ListenToAuthChanges.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(ListenToAuthChanges.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default AuthListenerSlice.reducer;