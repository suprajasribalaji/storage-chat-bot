import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, githubAuthProvider, googleAuthProvider } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth/auth';
import { addNewUser, updateExistingUser } from './signup';
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
      return await handleUserLogin(userCredential, null, thunkAPI);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const requestUserLoginByGoogle = createAsyncThunk(
  Actions.requestUserLoginByGoogle,
  async (_, thunkAPI) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.uid || !currentUser.email) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }
      
      const isAlreadyAnUser: number | undefined = await addNewUser({ uid: currentUser.uid, mail: currentUser.email });
      
      if(isAlreadyAnUser === 1) await updateExistingUser({ uid: currentUser.uid, mail: currentUser.email, provider: 'Google' });

      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      return await handleUserLogin(userCredential, 'Google', thunkAPI);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login with Google failed');
    }
  }
);

export const requestUserLoginByGithub = createAsyncThunk(
  Actions.requestUserLoginByGithub,
  async (_, thunkAPI) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.uid || !currentUser.email) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }
      
      const isAlreadyAnUser: number | undefined = await addNewUser({ uid: currentUser.uid, mail: currentUser.email });
      
      if(isAlreadyAnUser === 1) await updateExistingUser({ uid: currentUser.uid, mail: currentUser.email, provider: 'Github' });

      const userCredential = await signInWithPopup(auth, githubAuthProvider);
      return await handleUserLogin(userCredential, 'Github', thunkAPI);
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
        state.status = 'loading';
      })
      .addCase(requestUserLogin.fulfilled, (state: any, action) => {
        state.currentUser = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestUserLogin.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(requestUserLoginByGoogle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestUserLoginByGoogle.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestUserLoginByGoogle.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(requestUserLoginByGithub.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestUserLoginByGithub.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestUserLoginByGithub.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
