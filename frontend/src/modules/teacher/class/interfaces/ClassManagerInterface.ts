export interface Clazz {
    id: number;
    name: string;
    password?: string | null;
    teacher: User;
    announcements: Announcement[];
}

export interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    profileImageUrl?: string | null;
}

export interface ClassUser {
    id: number;
    user: User;
    isTeacher: boolean;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    createdBy: User;
}
