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
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
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
      .addCase(requestUserLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestUserLogout.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestUserLogout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default LogoutSlice.reducer;