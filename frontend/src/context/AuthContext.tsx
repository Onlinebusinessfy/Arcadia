import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import authService from "../services/authService";
import type {
    User,
    LoginResponse,
} from "../services/authService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginResponse) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const access = localStorage.getItem("access");

        if (!access) {
            setLoading(false);
            return;
        }

        try {
            const user = await authService.getMe(access);
            setUser(user);
        } catch (error) {
            console.error(error);

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(data: LoginResponse) {
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

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de un AuthProvider."
        );
    }

    return context;
}