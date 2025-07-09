export interface UserInfo {
    id: number;
    username: string;
    fullName: string;
    email: string;
    roleName: string;
    profileImageUrl: string | null;
    passwordChanged: boolean;
}

export interface UserRequest {
    username: string;
    password: string;
    fullName: string;
    email: string;
}

export interface UserResponse {
    id: number;
    username: string;
    fullName: string;
    email: string;
    roleName: string;
    profileImageUrl: string | null;
    passwordChanged: boolean;
}
