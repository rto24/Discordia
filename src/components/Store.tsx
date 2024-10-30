import React, { useState, useEffect } from 'react';
import { storeItem } from '@/types/types';
import Image from 'next/image';

const ItemShop = () => {
  const [items, setItems] = useState<storeItem[]>([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await fetch("http://localhost:8080/store/items", {
          headers: { 'Content-Type' : 'application/json' }
        });
        if (!response.ok) {
          throw new Error('Failed to get store items');
        }
        const data: storeItem[] = await response.json();
        setItems(data);
        console.log(data);
      }
      catch (error) {
        console.error(error);
      }
    };
    getItems();
  }, [])

  return (
    <div>
      {items.map((item) => (
        <div className="flex flex-col" key={item.id}>
          <h1>{item.name}</h1>
          <p>{+item.price}</p>
          <p>{item.tier}</p>
          <p>{item.type}</p>
          {/* <img src="../../public/pheonix-feather.png" alt="Pheonix Feather" /> */}
          <Image 
            src="/pheonix-feather.png" 
            alt="Pheonix Feather"
            width={300}
            height={300}
          />
        </div>
      ))}
    </div>
  )
}

export default ItemShop