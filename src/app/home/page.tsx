"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

const Homepage = () => {
  const { username } = useUser();
  console.log(username)

  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Redirect Home {`Hello, ${username}`}
    </div>
  );
};

export default Homepage;