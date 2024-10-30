"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

const Store = () => {
  const { username } = useUser();
  console.log(username)

  return (
    <>
      {username ? (
        <h1> Store for {username}</h1>
      ) : (
        <div></div>
      )
      }
    </>
  );
};

export default Store;