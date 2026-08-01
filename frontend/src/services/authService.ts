const API_URL = import.meta.env.VITE_API_URL;

export interface User {
    id: number;
    username: string;
    email: string;
    profile_picture: string | null;
    bio: string;
    status: "online" | "away" | "busy" | "offline";
    created_at: string;
    username_last_changed: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

const authService = {
    async register(userData: RegisterData): Promise<RegisterResponse> {
        //  CORREGIDO: Agregar /api/
        const response = await fetch(`${API_URL}/api/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data: RegisterResponse = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async login(credentials: LoginData): Promise<LoginResponse> {
        //  CORREGIDO: Agregar /api/
        const response = await fetch(`${API_URL}/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data: LoginResponse = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async getMe(token: string): Promise<User> {
        //  CORREGIDO: Agregar /api/
        const response = await fetch(`${API_URL}/api/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data: User = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async refreshToken(refresh: string): Promise<{ access: string }> {
        //  CORREGIDO: Agregar /api/
        const response = await fetch(`${API_URL}/api/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh,
            }),
        });

        const data: { access: string } = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async updateProfile(
        token: string,
        formData: FormData
    ): Promise<User> {
        //  CORREGIDO: Agregar /api/
        const response = await fetch(`${API_URL}/api/profile/update/`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    },

    async updateStatus(
        token: string,
        status: string
    ) {
        //  CORREGIDO: Agregar /api/
        const response = await fetch(
            `${API_URL}/api/profile/status/`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo actualizar el estado"
            );
        }

        return await response.json();
    }
};

export default authService;