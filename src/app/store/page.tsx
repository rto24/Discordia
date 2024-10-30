"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import ItemShop from "@/components/Store";

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
      <ItemShop />
    </>
  );
};

export default Store;