import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../../config/firebase.config';
import { setCurrentUser } from '../auth/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { Actions } from '../../actions/actionPayload';
import { AddNewUserPayload, RequestUserCredentialsPayload } from './userPayload';

export const requestUserSignup = createAsyncThunk(
  Actions.requestUserSignup,
  async ({ email, password }: RequestUserCredentialsPayload, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user) return thunkAPI.rejectWithValue("User creation failed");
      
      thunkAPI.dispatch(setCurrentUser({ uid: user.uid, email: user.email, profilePictureURL: user.photoURL, user: user }));

      const provider = 'EmailAndPassword', uid = user.uid, mail = user.email;;
      
      await addNewUser({uid, mail, provider});
      
      return { uid: user.uid, email: user.email, profilePictureURL: user.photoURL, user: user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const addNewUser = async ({ uid, mail, provider }: AddNewUserPayload) => {
  try {
    const userQuery = query(collection(database, 'Users'), where('email', '==', mail));
    const existingUsers = await getDocs(userQuery);

    if (!existingUsers.empty) return 1;

    const userRef = doc(database, 'Users', uid);
    const name = mail?.split('@')[0];

    await setDoc(userRef, {
      email: mail,
      full_name: name,
      nick_name: name,
      plan: 'Basic',
      type_of_provider: provider,
      is_2fa_enabled: false,
    });

    console.log("User added to Firestore successfully");
  } catch (error) {
    console.error("Error adding user data to Firestore: ", error);
  }
};

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
      .addCase(requestUserSignup.fulfilled, (state: any, action) => {
        state.currentUser = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestUserSignup.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default signupSlice.reducer;