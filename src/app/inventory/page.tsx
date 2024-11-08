import React from "react";
import { cookies } from "next/headers";
import InventoryItems from "@/components/Inventory";
import { storeItem } from "@/types/types";

async function getUserId(): Promise<number> {
  const cookieStore = cookies(); 
  const token = cookieStore.get('auth_token');

  if (!token) {
    console.error('No auth token found');
    throw new Error('No auth token found');
  }

  try {
    const responseUser = await fetch("http://localhost:8080/auth/status", {
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      cache: 'no-store',
      credentials: 'include', 
    });
    
    if (!responseUser.ok) {
      console.error(`Failed to get user info: ${responseUser.statusText}`);
      throw new Error("Failed to get user info");
    }

    const userData = await responseUser.json();
    return Number(userData.user.id);
  } catch (error) {
    console.error("Failed to get user data:", error);
    return 0;
  }
}

async function getInventoryItems(userId: number): Promise<storeItem[]> {
  try {
    const responseInv = await fetch(`http://localhost:8080/inventory/${userId}`, {
      cache: 'no-store',
    });

    if (!responseInv.ok) {
      console.error(`Failed to get inventory: ${responseInv.statusText}`);
      throw new Error("Failed to get inventory");
    }

    const invData: storeItem[] = await responseInv.json();
    return invData;
  } catch (error) {
    console.error("Failed to get inventory:", error);
    return [];
  }
}

const Inventory = async () => {
  try {
    const userId = await getUserId();
    const initialItems = await getInventoryItems(userId);

    return (
      <div>
        <InventoryItems initialItems={initialItems} />
      </div>
    );
  } catch (error) {
    console.error("Failed to render inventory page:", error);
    return (
      <div>
        <h1>Failed to load inventory. Please try again later.</h1>
      </div>
    );
  }
};

export default Inventory;