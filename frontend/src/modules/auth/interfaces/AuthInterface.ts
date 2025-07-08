export interface AuthState {
    accessToken: string | null;
    authenticated: boolean;
    role: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    accesstoken: string;
    authenticated: boolean;
    role: string;
}

export interface RefreshRespondse {
    accesstoken: string;
    authenticated: boolean;
    role: string;
}

export interface LogoutPayload {
    token: string;
}
