import React, { useState, useEffect } from 'react';
import { storeItem } from '@/types/types';
import Image from 'next/image';
import { Button } from './ui/button';
import { useUser } from '@/context/UserContext';

// const getToken = (): string | null => {
//   const tokenMatch = document.cookie.match(/(^|;)\\s*token=([^;]+)/);
//   console.log(tokenMatch);
//   return tokenMatch ? tokenMatch[2] : null;
// }

const ItemShop = () => {
  const [items, setItems] = useState<storeItem[]>([]);
  const [currency, setCurrency] = useState<number>(0);

  const { username, token } = useUser();

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
        data.sort((a, b) => a.id - b.id);
        setItems(data);
        console.log(data);
      }
      catch (error) {
        console.error(error);
      }
    };
    getItems();
  }, []);

  useEffect(() => {
    const getCurrency = async (username: string | null) => {
      try {
        const response = await fetch("http://localhost:8080/store/currency", {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify({ username })
        });
        if (!response.ok) {
          throw new Error('Failed to get currency');
        }
        const data = await response.json();
        setCurrency(data);
      }
      catch (error) {
        console.error(error);
      }
    };
    getCurrency(username);
  }, [username])

  useEffect(() => {
    if (!token) return;
  
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.currency !== undefined) {
        setCurrency(data.currency);
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  
    ws.onclose = () => console.log("Disconnected from WebSocket server");
  
    return () => {
      ws.close();
    };
  }, [token]);

  return (
    <div>
      <h1>Item Shop</h1>
      <h2>{`${currency}`}</h2>
      <div className="grid gap-4 grid-cols-5 grid-rows-4">
        {items.map((item) => {
          item.name = item.name.toLowerCase().replace(" ", "-");
          const imagePath = `/${item.name}.png`;
          return (
            <div className="flex flex-col" key={item.id}>
              <h2>{item.name}</h2>
              <Image 
                src={imagePath}
                alt={item.name}
                width={200}
                height={200}
              />
              <p>Price: {item.price}</p>
              <p>{item.tier}</p>
              <p>{item.type}</p>
              <p>{item.description}</p>
              <Button>Purchase</Button>
            </div>
          )
        })}
      </div>
    </div>
  )
};

export default ItemShop