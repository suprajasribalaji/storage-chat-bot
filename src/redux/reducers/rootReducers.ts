import AuthReducer from "../slices/auth/auth";
import SignupReducer from "../slices/user/signup";
import LoginReducer from "../slices/user/login";
import LogoutReducer from "../slices/user/logout";
import AuthListenerReducer from "../slices/auth/AuthListener.ts";

export const rootReducers = {
    auth: AuthReducer,
    signup: SignupReducer,
    login: LoginReducer,
    logout: LogoutReducer,
    authListener: AuthListenerReducer,
}