const API_URL = import.meta.env.VITE_API_URL;

const authService = {

    async register(userData: { username: string; email: string; password: string; confirm_password: string; }): Promise<{ message: string, user: { id: number, username: string, email: string } }> {
        const response = await fetch(`${API_URL}register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async login(credentials: { username: string; password: string; }): Promise<{ access: string, refresh: string, user: string }> {
        const response = await fetch(`${API_URL}login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async getMe(token: string): Promise<{ id: number, username: string, email: string, profile_picture: null, bio: string, status: string, created_at: string }> {
        const response = await fetch(`${API_URL}me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async refreshToken(refresh: string): Promise<{ access: string }> {
        const response = await fetch(`${API_URL}refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },
};

export default authService;
