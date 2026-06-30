import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import authService from "../services/authService";

type AuthContextType = {
    user: any | null;
    loading: boolean;
    login: (data: { access: string; refresh: string }) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

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

            const data = await authService.getMe(access);

            setUser(data);

        } catch (error) {

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            setUser(null);

        }

        setLoading(false);

    }

    async function login(data: { access: string; refresh: string; }) {

        localStorage.setItem(
            "access",
            data.access
        );

        localStorage.setItem(
            "refresh",
            data.refresh
        );

        const user = await authService.getMe(
            data.access
        );

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