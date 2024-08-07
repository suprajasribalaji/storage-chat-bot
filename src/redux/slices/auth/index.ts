import { createSlice } from "@reduxjs/toolkit";

interface User {
    uid: string;
    email: string | null;
}

export interface AuthState {
    currentUser: User | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    currentUser: null,
    isLoading: true,
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser(state, action) {
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