const API_URL = "http://127.0.0.1:8000/api/";

const authService = {

    async register(userData) {
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

    async login(credentials) {
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

    async getMe(token) {
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

    async refreshToken(refresh) {
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