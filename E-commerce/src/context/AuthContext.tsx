// import { createContext, useContext, useEffect, useState } from "react";

// interface User {
//     name: string;
//     email: string;
//     role:number
// }

// interface AuthContextType {
//     token: string | null;
//     user: User | null;
//     login: (token: string, userData: User) => void;
//     logout: () => void;
//     isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [token, setToken] = useState<string | null>(null);

//     // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//     const [user, setUser] = useState<User | null>(null);

//     // auto login on refresh
//     useEffect(() => {
//         const storedToken = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         if (storedToken) {
//             setToken(storedToken);
//         }

//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     }, []);

//     // const login = (newToken: string, userData: User) => {
//     //     localStorage.setItem("token", newToken);
//     //     localStorage.setItem("user", JSON.stringify(userData));
//     //     setToken(newToken);
//     //     setUser(userData);
//     // };

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setToken(null);
//         setUser(null);
//     };
//     const isAuthenticated = Boolean(token);
//     return (
//         <AuthContext.Provider
//             value={{
//                 token,
//                 user,
//                 // login,
//                 logout,
//                 isAuthenticated
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used inside AuthProvider");
//     }
//     return context;
// };


import { createContext, useContext, useEffect, useState } from "react";

interface User {
    name: string;
    email: string;
    role: number;
}

interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const API = import.meta.env.VITE_API_URL;


    // Fetch profile from server
    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API}/service/user/me`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch profile");

            const data = await res.json();
            setUser(data.data);
        } catch (err) {
            setUser(null);
        }
    };

    // checking auth on refresh
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API}/service/user/refreshToken`, {
                    method: "POST",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                console.log('data: ', data);
                // After refresh token succeeds, fetch profile
                await fetchProfile();
                // setUser(data.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();



    }, []);

    const login = async() => {
        // setUser(userData);
         setLoading(true);
        await fetchProfile();
        setLoading(false);
    };

    const logout = async () => {
        await fetch(`${API}/service/user/logout`, {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                loading,
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