"use client";

import React, { createContext, useContext, useState } from "react";

interface VFlixUploadContextType {
    isVFlixUploadOpen: boolean;
    openVFlixUpload: () => void;
    closeVFlixUpload: () => void;
}

const VFlixUploadContext = createContext<VFlixUploadContextType | undefined>(undefined);

export const VFlixUploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVFlixUploadOpen, setIsVFlixUploadOpen] = useState(false);

    const openVFlixUpload = () => setIsVFlixUploadOpen(true);
    const closeVFlixUpload = () => setIsVFlixUploadOpen(false);

    return (
        <VFlixUploadContext.Provider value={{ isVFlixUploadOpen, openVFlixUpload, closeVFlixUpload }}>
            {children}
        </VFlixUploadContext.Provider>
    );
};

export const useVFlixUpload = () => {
    const context = useContext(VFlixUploadContext);
    if (!context) {
        throw new Error("useVFlixUpload must be used within VFlixUploadProvider");
    }
    return context;
};
