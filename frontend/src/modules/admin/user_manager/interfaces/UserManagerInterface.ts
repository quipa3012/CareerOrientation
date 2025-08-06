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

export type UserUpdateRequest = Omit<UserRequest, "password"> & {
    password?: string;
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

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface GenerateTeacherRequest {
    username: string;
    fullName: string;
    email: string;
}

export interface GeneratedAccountResponse {
    username: string;
    rawPassword: string;
}
