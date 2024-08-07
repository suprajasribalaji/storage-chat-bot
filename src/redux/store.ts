import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./slices/auth/index";
import SignupReducer from "./slices/signup/index";
import LoginReducer from "./slices/login/index";
import LogoutReducer from "./slices/logout/index";
import AuthListenerReducer from "./slices/auth/AuthListener";

export interface RootState {
    auth: AuthState;
    signup: { isLoading: boolean };
    login: { isLoading: boolean };
    logout: { isLoading: boolean };
    authListener: { isLoading: boolean };
}

const store = configureStore<RootState>({
    reducer: {
        auth: AuthReducer,
        signup: SignupReducer,
        login: LoginReducer,
        logout: LogoutReducer,
        authListener: AuthListenerReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export default store;