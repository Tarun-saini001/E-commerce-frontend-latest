import { createContext, useContext, useEffect, useState } from "react";

interface User {
    name: string;
    email: string;
    role:number
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [user, setUser] = useState<User | null>(null);

    // auto login on refresh
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);

    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };
    const isAuthenticated = Boolean(token);
    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};