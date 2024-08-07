import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./slices/auth/index";
import SignupReducer from "./slices/signup/index";
import LoginReducer from "./slices/login/index";
import LogoutReducer from "./slices/logout/index";
import AuthListenerReducer from "./slices/auth/AuthListener";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        signup: SignupReducer,
        login: LoginReducer,
        logout: LogoutReducer,
        authListener: AuthListenerReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;