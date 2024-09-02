import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, githubAuthProvider, googleAuthProvider } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth/auth';
import { addNewUser } from './signup';
import { Actions } from '../../actions/actionPayload';
import { RequestUserCredentialsPayload, RequestUserLoginPayload } from './userPayload';

const handleUserLogin = async ({userCredential, provider, thunkAPI}: RequestUserLoginPayload) => {
  try {
    const user = userCredential.user;
    const profilePicture = user.photoURL;
    if (!user) return thunkAPI.rejectWithValue("User not found");
    if (provider) await addNewUser({ uid: user.uid, mail: user.email, provider });
    thunkAPI.dispatch(setCurrentUser({ uid: user.uid, email: user.email, profilePictureURL: profilePicture, user: user }));
    return { uid: user.uid, email: user.email, profilePictureURL: profilePicture, user: user };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Login handling failed");
  }
};

export const requestUserLogin = createAsyncThunk(
  Actions.requestUserLogin,
  async ({ email, password }: RequestUserCredentialsPayload, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return await handleUserLogin({ userCredential, provider: null, thunkAPI });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const requestUserLoginByGoogle = createAsyncThunk(
  Actions.requestUserLoginByGoogle,
  async (_, thunkAPI) => {
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      return await handleUserLogin({ userCredential, provider: 'Google', thunkAPI });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login with Google failed');
    }
  }
);

export const requestUserLoginByGithub = createAsyncThunk(
  Actions.requestUserLoginByGithub,
  async (_, thunkAPI) => {
    try {
      const userCredential = await signInWithPopup(auth, githubAuthProvider);
      return await handleUserLogin({ userCredential, provider: 'Github', thunkAPI });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login with GitHub failed');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    currentUser: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestUserLogin.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(requestUserLogin.fulfilled, (state: any, action) => {
        state.currentUser = action.payload;
        state.status = 'fulfilled';
        state.error = null;
      })
      .addCase(requestUserLogin.rejected, (state: any, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })
      .addCase(requestUserLoginByGoogle.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(requestUserLoginByGoogle.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.status = 'fulfilled';
        state.error = null;
      })
      .addCase(requestUserLoginByGoogle.rejected, (state: any, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      })
      .addCase(requestUserLoginByGithub.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(requestUserLoginByGithub.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.status = 'fulfilled';
        state.error = null;
      })
      .addCase(requestUserLoginByGithub.rejected, (state: any, action) => {
        state.status = 'rejected';
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
