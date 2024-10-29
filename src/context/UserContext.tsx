// // UserContext.tsx

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import jwt_decode from "jwt-decode";

// interface UserContextType {
//   username: string | null;
//   setUsername: React.Dispatch<React.SetStateAction<string | null>>;
// }

// // Set a default value with a noop function for setUsername
// const UserContext = createContext<UserContextType>({
//   username: null,
//   setUsername: () => {},
// });

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [username, setUsername] = useState<string | null>(null);
//   console.log("COOKIE", document.cookie);

//   useEffect(() => {
//     const token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("auth_token"))
//       ?.split("=")[1];

//     if (token) {
//       try {
//         const decoded: { username: string } = jwt_decode(token);
//         setUsername(decoded.username);
//       } catch (error) {
//         console.error("Failed to decode JWT:", error);
//       }
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ username, setUsername }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   console.log(context);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };

// UserContext.tsx
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
          credentials: "include", // Ensure cookies are sent with the request
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user?.username || null);
        } else {
          console.error("Failed to fetch user data:", response.status);
          setUsername(null); // Clear username if not authenticated
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