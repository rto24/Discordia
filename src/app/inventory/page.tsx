"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

const Inventory = () => {
  const { username } = useUser();
  console.log(username)

  return (
    <>
      {username ? (
        <h1> Inventory for {username}!</h1>
      ) : (
        <div></div>
      )
      }
    </>
  )
};

export default Inventory;