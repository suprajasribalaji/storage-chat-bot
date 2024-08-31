export interface RequestUserCredentialsPayload {
    email: string;
    password: string;
};

export interface AddNewUserPayload {
    uid: string;
    mail: string | null;
    provider: string;
};