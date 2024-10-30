"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    console.log("REACHED USE EFFECT USE CONTEXT");
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/status", {
          credentials: "include", 
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user?.username || null);
        } else {
          console.error("Failed to fetch user data:", response.status);
          setUsername(null); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};