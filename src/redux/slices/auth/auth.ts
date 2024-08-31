import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStatePayload, UserPayload } from "./authPayload";

const initialState: AuthStatePayload = {
    currentUser: null,
    isLoading: true,
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<UserPayload | null>) {
            state.currentUser = action.payload;
            state.isLoading = false;
        },
        clearCurrentUser(state) {
            state.currentUser = null;
            state.isLoading = false;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        }
    },
})

export const { setCurrentUser, clearCurrentUser, setLoading } = AuthSlice.actions;
export default AuthSlice.reducer;