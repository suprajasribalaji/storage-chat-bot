import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth';

export const requestUserSignup = createAsyncThunk(
  'signup/requestUserSignup',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      thunkAPI.dispatch(setCurrentUser({ uid: user.uid, email: user.email }));
      return { uid: user.uid, email: user.email };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
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
      .addCase(requestUserSignup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestUserSignup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestUserSignup.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default signupSlice.reducer;
