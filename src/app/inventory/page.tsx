"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import InventoryItems from "@/components/Inventory";

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
      <InventoryItems />
    </>
  )
};

export default Inventory;