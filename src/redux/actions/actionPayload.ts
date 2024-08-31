export enum Actions {
    listenToAuthChanges = 'auth/listenToAuthChanges',
    requestUserSignup = 'signup/requestUserSignup',
    requestUserLoginByProviders = 'login/requestUserLoginByProviders',
    requestUserLogin = 'login/requestUserLogin',
    requestUserLoginByGoogle = 'login/requestUserLoginByGoogle',
    requestUserLoginByGithub = 'login/requestUserLoginByGithub',
    requestUserLogout = 'logout/requestUserLogout',
    requestResetPassword = 'reset-password/requestResetPassword',
}