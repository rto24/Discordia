"use client"

import React, { useState, useEffect } from 'react';
import { storeItem, ItemShopProps } from '@/types/types';
import Image from 'next/image';
import { Button } from './ui/button';
import { useUser } from '@/context/UserContext';
import { CardContainer } from './ui/card';
import FilterBar from './FilterBar';
import { Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter, ModalProvider } from './ui/animated-modal';

const ItemShop = ({ initialItems }: ItemShopProps) => {
  const [items, setItems] = useState<storeItem[]>(initialItems);
  const [currency, setCurrency] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<storeItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { userId, username, token } = useUser();

  useEffect(() => {
    const getCurrency = async (username: string | null) => {
      if (typeof window === "undefined") return;
      try {
        if (!username) return;
        const response = await fetch("http://localhost:8080/store/currency", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        if (!response.ok) {
          throw new Error('Failed to get currency');
        }
        const data = await response.json();
        setCurrency(data);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrency(username);
  }, [username]);

  useEffect(() => {
    if (typeof window === "undefined" || !token) return;

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

  const handleModalOpen = (item: storeItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handlePurchase = async (item: storeItem) => {
    try {
      if (item.price > currency) {
        alert('Insufficient funds, you are poor');
        return;
      }
      
      const newUserBalance = currency - item.price;

      const response = await fetch(`http://localhost:8080/store/purchase/${userId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          currency: newUserBalance,
          itemId: item.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Purchase failed");
      }

      const updatedData = await response.json();
      setCurrency(updatedData.currency);
      alert("Congrats on the new item!");
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = (filteredItems: storeItem[]) => {
    setItems(filteredItems);
  };

  return (
    <ModalProvider>
    <div className="flex flex-col justify-center px-20 overflow-x-hidden">
      <h1 className="text-5xl font-bold mt-5 mb-5 text-white">ITEM SHOP</h1>
      <h2 className="text-2xl font-semibold text-white">BALANCE: ${currency}</h2>
      <FilterBar items={initialItems} onFilter={handleFilter}/>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item, index) => {
          const formattedItemName = item.name.toLowerCase().replace(/\s+/g, "-");
          const imagePath = `/${formattedItemName}.png`;

          const colorMap = {
            "Common": "text-gray-300 shadow-[0_0_30px_10px_rgba(209,213,219,0.7)]",
            "Rare": "text-blue-400 shadow-[0_0_30px_10px_rgba(96,165,250,0.7)]",
            "Epic": "text-purple-500 shadow-[0_0_30px_10px_rgba(168,85,247,0.7)]",
            "Legendary": "text-orange-500 shadow-[0_0_30px_10px_rgba(249,115,22,0.7)]"
          };

          const tierColor = colorMap[item.tier];

          return (
            <CardContainer
              key={index}
              className={`text-white p-4 rounded-lg bg-zinc-900 flex flex-col items-center h-full w-full transition-all duration-300 ${tierColor} hover:shadow-lg hover:${colorMap[item.tier].split(' ')[1]} z-10`} // Added z-index for debugging
              containerClassName="w-[350px] h-[650px]"
            >
              <div className="flex flex-col items-center justify-center mb-4">
                <Image
                  src={imagePath}
                  alt={item.name}
                  width={200}
                  height={200}
                />
                <h3 className="text-lg font-semibold text-white">
                  {item.name}
                </h3>
                <h3 className={`font-semibold ${tierColor.split(' ')[0]} text-center`}>{item.tier}</h3>
                <p className="text-base font-semibold">Price: ${item.price}</p>
                <p className="text-sm text-gray-400 text-center mb-5 mt-3">{item.description}</p>
              </div>
              <ModalTrigger
                className="outline outline-1 z-20"
                onClick={() => handleModalOpen(item)}
              >
                Purchase
              </ModalTrigger>
            </CardContainer>
          );
        })}
      </div>
      {modalOpen && (
        <Modal>
          <ModalBody>
            {selectedItem && (
              <ModalContent>
                <h2 className="text-2xl font-bold mb-4">Purchase {selectedItem.name}</h2>
                <p>Price: ${selectedItem.price}</p>
                <p className="mb-4">{selectedItem.description}</p>
                <ModalFooter>
                  <Button onClick={() => handlePurchase(selectedItem)}>
                    Confirm Purchase
                  </Button>
                  <Button onClick={handleModalClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            )}
          </ModalBody>
        </Modal>
      )}
    </div>
    </ModalProvider>
  );
};

export default ItemShop;