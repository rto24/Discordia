"use client"

import React, { useState, useMemo, useEffect } from "react";
import { storeItem, StoreSearchParams } from "@/types/types";

interface FilterBarProps {
  items: storeItem[];
  onFilter: (filteredItems: storeItem[]) => void;
}

const FilterBar = ({ items, onFilter }: FilterBarProps) => {
  const [ searchParams, setSearchParams ] = useState<StoreSearchParams>({ term: "", filters: {} })

  const itemNames = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.name)))
  }, [items]);

  const tiers = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.tier)))
  }, [items]);

  const types = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.type)))
  }, [items]);

  useEffect(() => {
    console.log(itemNames, tiers, types)
  }, [itemNames, tiers, types])

  return (
    <div>
      Search yay
    </div>
  )
};

export default FilterBar;