// context/TrainerSidebarContext.tsx
import { createContext, useContext, useState } from 'react';

const TrainerSidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}>({ isOpen: false, toggle: () => {}, close: () => {} });

export const TrainerSidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <TrainerSidebarContext.Provider value={{
            isOpen,
            toggle: () => setIsOpen(prev => !prev),
            close: () => setIsOpen(false),
        }}>
            {children}
        </TrainerSidebarContext.Provider>
    );
};

export const useTrainerSidebar = () => useContext(TrainerSidebarContext);