import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, githubAuthProvider, googleAuthProvider } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth/auth';
import { addNewUser } from './signup';
import { Actions } from '../../actions/actionPayload';
import { RequestUserCredentialsPayload } from './userPayload';

const handleUserLogin = async (userCredential: any, provider: string | null, thunkAPI: any) => {
  const user = userCredential.user;
  if (!user) return thunkAPI.rejectWithValue("User not found");

  const profilePicture = user.photoURL;
  thunkAPI.dispatch(setCurrentUser({ uid: user.uid, email: user.email, profilePictureURL: profilePicture, user: user }));

  if (provider) {
    await addNewUser({ uid: user.uid, mail: user.email, provider });
  }

  return { uid: user.uid, email: user.email, profilePictureURL: profilePicture, user: user };
};

export const requestUserLogin = createAsyncThunk(
  Actions.requestUserLogin,
  async ({ email, password }: RequestUserCredentialsPayload, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('user ----------<<<<<<<<<<< ', userCredential.user);
      
      return await handleUserLogin(userCredential, null, thunkAPI);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const requestUserLoginByGoogle = createAsyncThunk(
  Actions.requestUserLoginByGoogle,
  async (_, thunkAPI) => {
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      return await handleUserLogin(userCredential, 'google', thunkAPI);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const requestUserLoginByGithub = createAsyncThunk(
  Actions.requestUserLoginByGithub,
  async (_, thunkAPI) => {
    try {
      const userCredential = await signInWithPopup(auth, githubAuthProvider);
      return await handleUserLogin(userCredential, 'github', thunkAPI);
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
