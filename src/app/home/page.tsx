"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

const Homepage = () => {
  const { username } = useUser();
  console.log(username)

  return (
    <>
      {username ? (
        <h1> Welcome Back {username}!</h1>
      ) : (
        <div></div>
      )
      }
    </>
  )
};

export default Homepage;