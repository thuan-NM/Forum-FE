import { createContext, ReactNode, useContext, useState } from "react";

// Tạo context
interface AuthContextType {
    registeredEmail: string;
    setRegisteredEmail: (email: string) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo provider để bọc toàn bộ ứng dụng
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [registeredEmail, setRegisteredEmail] = useState<string>("");

    return (
        <AuthContext.Provider value={{ registeredEmail, setRegisteredEmail }}>
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