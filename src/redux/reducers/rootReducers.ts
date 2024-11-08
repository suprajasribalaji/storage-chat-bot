import AuthReducer from "../slices/auth/auth";
import ApiReducer from "../slices/user/api.ts";
import SignupReducer from "../slices/user/signup";
import LoginReducer from "../slices/user/login";
import LogoutReducer from "../slices/user/logout";
import AuthListenerReducer from "../slices/auth/AuthListener.ts";

export const rootReducers = {
    auth: AuthReducer,
    api: ApiReducer,
    signup: SignupReducer,
    login: LoginReducer,
    logout: LogoutReducer,
    authListener: AuthListenerReducer,
}