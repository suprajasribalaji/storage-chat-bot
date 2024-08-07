import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth';

interface LoginPayload {
    email: string
    password: string
}

export const login = createAsyncThunk<void, LoginPayload>(
  'login/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      thunkAPI.dispatch(setCurrentUser({ uid: user.uid, email: user.email }));
    } catch (error) {
      // Handle login error
      throw error;
    }
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
