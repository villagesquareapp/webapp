"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface GuestContextType {
    isGuest: boolean;
    showLoginModal: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    currentPath: string;
    setCurrentPath: (path: string) => void;
}

const GuestContext = createContext<GuestContextType>({
    isGuest: false,
    showLoginModal: false,
    openLoginModal: () => {},
    closeLoginModal: () => {},
    currentPath: "",
    setCurrentPath: () => {},
});

export const GuestProvider = ({
    children,
    isGuest,
    currentPath: initialPath,
}: {
    children: React.ReactNode;
    isGuest: boolean;
    currentPath: string;
}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentPath, setCurrentPath] = useState(initialPath);

    const openLoginModal = useCallback(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("redirectAfterLogin", currentPath);
        }
        setShowLoginModal(true);
    }, [currentPath]);

    const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

    return (
        <GuestContext.Provider value={{ isGuest, showLoginModal, openLoginModal, closeLoginModal, currentPath, setCurrentPath }}>
            {children}
        </GuestContext.Provider>
    );
};

export const useGuest = () => useContext(GuestContext);
