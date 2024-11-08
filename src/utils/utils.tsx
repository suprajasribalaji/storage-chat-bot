export type FieldType = {
    email: string;
    password: string;
    remember?: string;
};

export type Enable2FAFieldType = {
    phoneNumber: string
}

export interface User {
    email: string;
    full_name: string;
    nick_name: string | undefined;
    plan: string;
    type_of_provider: string;
};

export interface Profile {
    full_name: string;
    nick_name: string;
    email: string;
};

export interface RespondedMessage {
    type: string;
    content?: string;
    file_name?: string;
    downloadable_url?: string;
    timestamp: number;
    responded_at?: number;
    noFileFound?: boolean;
}

export const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
};