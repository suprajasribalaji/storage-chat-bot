import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, githubAuthProvider, googleAuthProvider } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth/auth';
import { addNewUser } from './signup';
import { Actions } from '../../actions/actionPayload';
import { OnRequestGenerateAndSendOTP, RequestUserCredentialsPayload } from './userPayload';
import axios from 'axios';

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
      const userCredential = await signInWithPopup(auth, githubAuthProvider);
      return await handleUserLogin(userCredential, 'Github', thunkAPI);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login with GitHub failed');
    }
  }
);

export const requestGenerateAndSendOTP = createAsyncThunk<any, OnRequestGenerateAndSendOTP>(
  Actions.requestGenerateAndSendOTP,
  async (data, thunkAPI) => {
    try {
      const { email, nickName } = data;
      const response = await axios.post('http://localhost:5002/generate-send-otp', { email: email, nickName: nickName });
      return response;
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.message || 'Generate and Send OTP failed');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    currentUser: null,
    status: 'idle',
    error: null,
    paymentDetails:{}
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
      })      

      .addCase(requestGenerateAndSendOTP.pending,(state:any)=>{
        state.status = 'loading';
      })
      .addCase(requestGenerateAndSendOTP.fulfilled,(state:any, action:any)=>{
        state.status = 'succeeded';
        state.otpDetails = action.payload
        state.error = null;
      })
      .addCase(requestGenerateAndSendOTP.rejected,(state:any, action)=>{
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
