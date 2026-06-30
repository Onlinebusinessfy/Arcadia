import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function checkUser() {
        const access = localStorage.getItem("access");

        if (!access) {
            setLoading(false);
            return;
        }

        try {
            const data = await authService.getMe(access);
            setUser(data);
        } catch {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setUser(null);
        }

        setLoading(false);
    }

    useEffect(() => {
        async function initializeUser() {
            await checkUser();
        }

        initializeUser();
    }, []);

    async function login(data) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        const user = await authService.getMe(data.access);
        setUser(user);
    }

    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}