export interface User {
    id: number;
    username: string;
    email: string;
    profile_picture: string | null;
    bio: string;
    status: "online" | "away" | "busy" | "offline";
    created_at: string;
}