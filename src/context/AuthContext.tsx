import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { LogoutAccount } from "../services/AuthServices";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess, logout as logoutAction } from "../store/slices/authSlice";
import { clearUser } from "../store/slices/userSlice";

interface AuthContextType {
    registeredEmail: string;
    setRegisteredEmail: (email: string) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [registeredEmail, setRegisteredEmail] = useState<string>("");
    const [token, setToken] = useState<string | null>(localStorage.getItem("authToken") || null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
            dispatch(loginSuccess({ token }));
        } else {
            localStorage.removeItem("authToken");
            dispatch(logoutAction());
            dispatch(clearUser());
        }
    }, [token, dispatch]);

    const logout = async () => {
        try {
            await LogoutAccount();
            setToken(null);
            setRegisteredEmail("");
            dispatch(logoutAction()); // Xóa token trong Redux
            dispatch(clearUser()); // Xóa user trong Redux
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ registeredEmail, setRegisteredEmail, token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};