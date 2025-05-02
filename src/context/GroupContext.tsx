import React, { createContext, useState, ReactNode, useContext } from 'react';

type FormData = {
    name: string;
    description: string;
};

interface GroupContextType {
    formData: FormData | null;
    setFormData: (data: FormData | null) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData | null>(null);

    return (
        <GroupContext.Provider value={{ formData, setFormData }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroupContext = () => {
    const context = useContext(GroupContext);
    if (!context) {
        throw new Error("useGroupContext must be used within a GroupProvider");
    }
    return context;
};
