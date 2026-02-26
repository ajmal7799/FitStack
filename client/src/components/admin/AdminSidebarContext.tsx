// context/AdminSidebarContext.tsx
import { createContext, useContext, useState } from 'react';

const AdminSidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}>({ isOpen: false, toggle: () => {}, close: () => {} });

export const AdminSidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <AdminSidebarContext.Provider value={{
            isOpen,
            toggle: () => setIsOpen(prev => !prev),
            close: () => setIsOpen(false),
        }}>
            {children}
        </AdminSidebarContext.Provider>
    );
};

export const useAdminSidebar = () => useContext(AdminSidebarContext);