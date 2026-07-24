export interface User {
    id: number;
    username: string;
    email: string;
    bio: string | null;
    profile_picture: string | null;
    status: string;
    created_at: string;
    username_last_changed: string | null;
}