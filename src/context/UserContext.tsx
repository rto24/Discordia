"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userId: number | null;
  username: string | null;
  token: string | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  username: null,
  token: null,
  setUserId: () => {},
  setUsername: () => {},
  setToken: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("REACHED USE EFFECT USE CONTEXT");
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/status", {
          credentials: "include", 
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user.id);
          setUsername(data.user?.username || null);
          setToken(data.token || null);
        } else {
          console.error("Failed to fetch user data:", response.status);
          setUserId(null);
          setUsername(null); 
          setToken(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserId(null);
        setUsername(null);
        setToken(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, username, token, setUserId, setUsername, setToken }}>
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