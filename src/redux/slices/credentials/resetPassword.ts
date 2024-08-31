import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Actions } from "../../actions/actionPayload";
import { UserPayload } from "../auth/authPayload";
import axios from "axios"; 

const handleGetResetPasswordLink = async (email: string|null, thunkAPI: any) => {
    if (!email) return thunkAPI.rejectWithValue("Email is not given");
    const resetPasswordLink = await axios.post('http://localhost:5001/reset-password', { email: email });
    return resetPasswordLink;
}

const handleSetResetPasswordLink = async (email:string|null, resetPasswordLink:string, thunkAPI: any) => {
    if (!email) return thunkAPI.rejectWithValue("Email is not given");
    if (!resetPasswordLink) return thunkAPI.rejectWithValue("Reset Password Link is not found");
    const emailTriggerForResetPassword = await axios.post('http://localhost:5001/send-reset-password-link', { to: email, link: resetPasswordLink});
    return emailTriggerForResetPassword;
}

export const requestResetPassword = createAsyncThunk(
    Actions.requestResetPassword,
    async({email}: UserPayload, thunkAPI) => {
        try {
            const resetPasswordLink = await handleGetResetPasswordLink(email, thunkAPI);
            const emailTriggerForResetPassword = await handleSetResetPasswordLink(email, resetPasswordLink, thunkAPI);
            console.log('response: ', emailTriggerForResetPassword);
            return emailTriggerForResetPassword;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }  
    }
);

const ResetPasswordSlice = createSlice({
    name: 'reset-password',
    initialState:{
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(requestResetPassword.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(requestResetPassword.fulfilled, (state) => {
        state.isLoading = false;
        })
        .addCase(requestResetPassword.rejected, (state) => {
        state.isLoading = false;
        });
    },
});

export default ResetPasswordSlice.reducer;