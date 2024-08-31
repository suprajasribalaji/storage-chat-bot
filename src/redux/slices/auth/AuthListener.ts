import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { setCurrentUser, setLoading } from '.';

export const ListenToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (_, { dispatch }) => {
    const auth = getAuth();
    return new Promise<() => void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setCurrentUser({ uid: user.uid, email: user.email }));
        } else {
          dispatch(setCurrentUser(null));
        }
        dispatch(setLoading(false));
        resolve(unsubscribe);
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