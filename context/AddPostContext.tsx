"use client";

import React, { createContext, useContext, useState } from "react";

interface AddPostContextType {
  isAddPostOpen: boolean;
  openAddPost: () => void;
  closeAddPost: () => void;
}

const AddPostContext = createContext<AddPostContextType | undefined>(undefined);

export const AddPostProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);

  const openAddPost = () => setIsAddPostOpen(true);
  const closeAddPost = () => setIsAddPostOpen(false);

  return (
    <AddPostContext.Provider value={{ isAddPostOpen, openAddPost, closeAddPost }}>
      {children}
    </AddPostContext.Provider>
  );
};

export const useAddPost = () => {
  const context = useContext(AddPostContext);
  if (!context) {
    throw new Error("useAddPost must be used within AddPostProvider");
  }
  return context;
};
