import React from "react";
import ItemShop from "@/components/Store";
import { storeItem } from "@/types/types";


async function getStoreItems(): Promise<storeItem[]> {
  try {
    const response = await fetch('http://localhost:8080/store/items', {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch store items');
    }
    const items: storeItem[] = await response.json();
    items.sort((a, b) => a.id - b.id);
    return items;
  } catch (error) {
    console.error('Error fetching store items:', error);
    return [];
  }
};

const Store = async () => {
  const initialItems = await getStoreItems();

  return (
    <div>
      <ItemShop initialItems={initialItems} />
    </div>
  )
}

export default Store;