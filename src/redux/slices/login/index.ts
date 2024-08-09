import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, githubAuthProvider, googleAuthProvider } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth';

export const requestUserLogin = createAsyncThunk(
  'login/requestUserLogin',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      thunkAPI.dispatch(setCurrentUser({ uid: user.uid, email: user.email }));
      return { uid: user.uid, email: user.email };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const requestUserLoginByGoogle = createAsyncThunk(
  'login/requestUserLoginByGoogle',
  async (_, thunkAPI) => {
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      return userCredential.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const requestUserLoginByGithub = createAsyncThunk(
  'login/requestUserLoginByGoogle',
  async (_, thunkAPI) => {
    try {
      const userCredential = await signInWithPopup(auth, githubAuthProvider);
      return userCredential.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
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
      .addCase(requestUserLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestUserLogin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestUserLogin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default LoginSlice.reducer;