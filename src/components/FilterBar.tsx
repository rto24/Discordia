"use client"

import React, { useState, useMemo, useEffect } from "react";
import { storeItem, StoreSearchParams } from "@/types/types";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown';
import { ChevronDown } from "lucide-react";

interface FilterBarProps {
  items: storeItem[];
  onFilter: (filteredItems: storeItem[]) => void;
}

const FilterBar = ({ items, onFilter }: FilterBarProps) => {
  const [ searchParams, setSearchParams ] = useState<StoreSearchParams>(
    { 
      term: "", 
      filters: {
        itemName: [],
        tier: [],
        type: []
      } 
    }
  );

  const itemNames = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.name)))
  }, [items]);

  const tiers = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.tier)))
  }, [items]);

  const types = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.type)))
  }, [items]);

  const filteredData = useMemo(() => {
    return items.filter((item) => 
      (!searchParams.term ||
        item.name.toLowerCase().includes(searchParams.term.toLowerCase()) ||
        item.tier.toLowerCase().includes(searchParams.term.toLowerCase()) ||
        item.type.toLowerCase().includes(searchParams.term.toLowerCase())) &&
        (searchParams.filters.itemName?.length === 0 || searchParams.filters.itemName?.includes(item.name)) &&
        (searchParams.filters.tier?.length === 0 || searchParams.filters.tier?.includes(item.tier)) &&
        (searchParams.filters.type?.length === 0 || searchParams.filters.type?.includes(item.type))
    )
  }, [items, searchParams])

  const handleFilterUpdate = (filterKey: keyof StoreSearchParams["filters"], value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: prev.filters[filterKey]?.includes(value)
        ? prev.filters[filterKey]?.filter((v) => v !== value)
        : [...prev.filters[filterKey] || [], value]
      }
    }))
  };

  useEffect(() => {
    onFilter(filteredData);
  }, [filteredData, onFilter])

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      term: value,
    }))
  };

  useEffect(() => {
    console.log(itemNames, tiers, types)
    console.log("FILTERED DATA", filteredData)
  }, [itemNames, tiers, types, filteredData])

  return (
    <div>
      <Input 
        onChange={(e) => handleSearch(e.target.value)}
        value={searchParams.term}
        type="text" 
        placeholder="Search..."/>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors">
          <span className="text-gray-200">Item</span>
          <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {itemNames.map((name, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleFilterUpdate("itemName", name)}
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};

export default FilterBar;