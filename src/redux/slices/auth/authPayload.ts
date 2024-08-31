export interface UserPayload {
    uid: string;
    email: string | null;
    profilePictureURL: string | null;
    user: any;
};

export interface AuthStatePayload {
    currentUser: UserPayload | null; 
    isLoading: boolean;
};