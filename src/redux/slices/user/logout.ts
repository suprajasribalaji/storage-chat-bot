import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';
import { clearCurrentUser } from '../auth/auth';
import { Actions } from '../../actions/actionPayload';

export const requestUserLogout = createAsyncThunk(
  Actions.requestUserLogout,
  async (_, thunkAPI) => {
    try {
      await signOut(auth);
      thunkAPI.dispatch(clearCurrentUser());
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const LogoutSlice = createSlice({
  name: 'logout',
  initialState: {
    isLoading: false,
    currentUser: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestUserLogout.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(requestUserLogout.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.status = 'fulfilled';
        state.error = null;
      })
      .addCase(requestUserLogout.rejected, (state: any, action) => {
        state.isLoading = false;
        state.status = 'rejected';
        state.error = action.payload;
      });
  },
});

export default LogoutSlice.reducer;