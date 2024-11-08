export enum Actions {
    listenToAuthChanges = 'auth/listenToAuthChanges',
    requestUserSignup = 'signup/requestUserSignup',
    requestUserLoginByProviders = 'login/requestUserLoginByProviders',
    requestUserLogin = 'login/requestUserLogin',
    requestUserLoginByGoogle = 'login/requestUserLoginByGoogle',
    requestUserLoginByGithub = 'login/requestUserLoginByGithub',
    requestUserLogout = 'logout/requestUserLogout',
    requestResetPassword = 'api/requestResetPassword',
    requestGenerateAndSendOTP = 'api/requestGenerateAndSendOTP',
    requestOTPVerification = 'api/requestOTPVerification',
    requestExportFiles = 'api/requestExportFiles',
    requestPlanSubscription = 'api/requestPlanSubscription',
    requestPaymentVerification = 'api/requestPaymentVerification'
}