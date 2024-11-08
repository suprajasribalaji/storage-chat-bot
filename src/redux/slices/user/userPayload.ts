export interface RequestUserCredentialsPayload {
    email: string;
    password: string;
};

export interface RequestUserLoginPayload {
    userCredential: any;
    provider: string | null;
    thunkAPI: any;
};

export interface AddNewUserPayload {
    uid: string;
    mail: string | null;
    provider?: string;
};

export type OnRequestGenerateAndSendOTP = {
    email: string;
    nickName: string;
};

export type OnRequestOTPVerification = {
    email: string | null | undefined;
    otp: string;
};

export type OnRequestExportFiles = {
    fileDownloadURL: string[];
    fileNames: string[];
};

export type OnRequestResetPassword = {
    email: string;
};

export type OnRequestPlanSubscription = {
    plan: string;
};

export type OnRequestPaymentVerification = {
    fullName: string;
    nickName: string;
    subscribeTo: string;
    paymentResponse: any;
}