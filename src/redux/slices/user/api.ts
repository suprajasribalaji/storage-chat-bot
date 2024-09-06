import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  OnRequestExportFiles,
  OnRequestGenerateAndSendOTP,
  OnRequestOTPVerification,
  OnRequestPaymentVerification,
  OnRequestPlanSubscription,
  OnRequestResetPassword
} from "./userPayload";
import { Actions } from "../../actions/actionPayload";
import axios from "axios";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, database } from "../../../config/firebase.config";

const handleGetResetPasswordLink = async (email: string, thunkAPI: any) => {
  if (!email) return thunkAPI.rejectWithValue("Email is not given");
  try {
    const response = await axios.post('http://localhost:5001/reset-password', { email });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get reset password link');
  }
};

const handleSetResetPasswordLink = async (email: string, resetPasswordLink: string, thunkAPI: any) => {
  if (!email) return thunkAPI.rejectWithValue("Email is not given");
  if (!resetPasswordLink) return thunkAPI.rejectWithValue("Reset Password Link is not found");
  try {
    const response = await axios.post('http://localhost:5001/send-reset-password-link', { to: email, link: resetPasswordLink });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send reset password link');
  }
};

const handleProfileUpdation = async (subscribeTo: string) => {
  try {
    const userQuery = query(collection(database, "Users"), where("email", "==", auth.currentUser?.email));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref; 
        await updateDoc(userRef, {
            plan: subscribeTo,
            subscribed_at: Date.now()
        });             
    } else {
        console.log("No user found with that email.");
    }
  } catch (error) {
    console.error('Error while doing profile updation', error);
  }
};

export const requestResetPassword = createAsyncThunk<any, OnRequestResetPassword>(
  Actions.requestResetPassword,
  async(data, thunkAPI) => {
    try {
      const { email } = data;
      const resetPasswordLink = await handleGetResetPasswordLink(email, thunkAPI);
      const emailTriggerForResetPassword = await handleSetResetPasswordLink(email, resetPasswordLink, thunkAPI);
      console.log('response: ', emailTriggerForResetPassword);
      return emailTriggerForResetPassword;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || 'Sending reset password link failed');
    } 
  }
);

export const requestExportFiles = createAsyncThunk<any, OnRequestExportFiles>(
  Actions.requestExportFiles,
  async (data, thunkAPI) => {
    try {
      const { fileDownloadURL, fileNames } = data;
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5002/export-files',
        data: {
          fileDownloadURLs: fileDownloadURL,
          fileNames: fileNames,
        },
        responseType: 'blob',
        withCredentials: true,
      });

      if (response.status !== 200) throw new Error('Failed to export files');
            
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'File Export failed');
    }
  }
);

export const requestGenerateAndSendOTP = createAsyncThunk<any, OnRequestGenerateAndSendOTP>(
    Actions.requestGenerateAndSendOTP,
    async (data, thunkAPI) => {
      try {
        const { email, nickName } = data;
        const response = await axios.post('http://localhost:5001/generate-send-otp', { email: email, nickName: nickName });
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Generate and Send OTP failed');
      }
    }
);

export const requestOTPVerification = createAsyncThunk<any, OnRequestOTPVerification>(
  Actions.requestOTPVerification,
  async (data, thunkAPI) => {
    try {
      const { email, otp } = data;
      const response = await axios.post('http://localhost:5001/verify-otp', { email: email, otp: otp });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'OTP Verification failed');
    }
  }
);

export const requestPlanSubscription = createAsyncThunk<any, OnRequestPlanSubscription>(
  Actions.requestPlanSubscription,
  async (data, thunkAPI) => {
    try {
      const { plan } = data;
      const response = await axios.post('http://localhost:5001/subscribe', { plan });      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Plan subscription failed');
    }
  }
);

export const requestPaymentVerification = createAsyncThunk<any, OnRequestPaymentVerification>(
  Actions.requestPlanSubscription,
  async (data, thunkAPI) => {
    try {
      const { fullName, nickName, subscribeTo, paymentResponse } = data;
      const verificationResponse = await axios.post('http://localhost:5001/verify-payment', paymentResponse);
      const { paymentMethod, amount } = verificationResponse.data.paymentDetails;
      if (verificationResponse.status === 200) {
          console.log(`Payment successful for ${subscribeTo} : `, paymentResponse);
          await handleProfileUpdation(subscribeTo);                            
          const sendInvoiceResponse = await axios.post('http://localhost:5001/send-subscription-invoice', {
            subscribedTo: subscribeTo,
            orderId: paymentResponse.razorpay_order_id,
            paymentId: paymentResponse.razorpay_payment_id,
            fullName,
            nickName,
            email: auth.currentUser?.email,
            amount: amount/100,
            validity: 28,
            paymentMethod 
          });
          console.log('invoice response::: ', sendInvoiceResponse); 

          const response = {
            subscribedTo: subscribeTo,
            order_id: paymentResponse.razorpay_order_id,
            payment_id: paymentResponse.razorpay_payment_id,
            email: auth.currentUser?.email,
            payment_method: paymentMethod,
            amount: amount/100,
            name: fullName,
            created_at: Date.now()
          }
                   
          return response;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

const apiSlice = createSlice({
    name: 'api',
    initialState: {
      status: 'idle',
      error: null,
      resetPassword: null,
      exportFiles: null,
      generateAndSendOTP: null,
      otpVerification: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(requestResetPassword.pending,(state:any)=>{
          state.status = 'pending';
        })
        .addCase(requestResetPassword.fulfilled,(state:any, action:any)=>{
          state.status = 'fulfilled';
          state.resetPassword = action.payload;
          state.error = null;
        })
        .addCase(requestResetPassword.rejected,(state:any, action: any)=>{
          state.status = 'rejected';
          state.error = action.payload;
        })  
        .addCase(requestExportFiles.pending,(state:any)=>{
          state.status = 'pending';
        })
        .addCase(requestExportFiles.fulfilled,(state:any, action:any)=>{
          state.status = 'fulfilled';
          state.exportFiles = action.payload;
          state.error = null;
        })
        .addCase(requestExportFiles.rejected,(state:any, action: any)=>{
          state.status = 'rejected';
          state.error = action.payload;
        })
        .addCase(requestGenerateAndSendOTP.pending,(state:any)=>{
          state.status = 'pending';
        })
        .addCase(requestGenerateAndSendOTP.fulfilled,(state:any, action:any)=>{
          state.status = 'fulfilled';
          state.generateAndSendOTP = action.payload;
          state.error = null;
        })
        .addCase(requestGenerateAndSendOTP.rejected,(state:any, action: any)=>{
          state.status = 'rejected';
          state.error = action.payload;
        })
        .addCase(requestOTPVerification.pending,(state:any)=>{
          state.status = 'pending';
        })
        .addCase(requestOTPVerification.fulfilled,(state:any, action:any)=>{
          state.status = 'fulfilled';
          state.otpVerification = action.payload;
          state.error = null;
        })
        .addCase(requestOTPVerification.rejected,(state:any, action: any)=>{
          state.status = 'rejected';
          state.error = action.payload;
        });
    },
  });

export default apiSlice.reducer;
  