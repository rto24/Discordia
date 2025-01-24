"use client"

import React, { useState } from "react";
import { storeItem } from "@/types/types";

interface FilterBarProps {
  items: storeItem[];
  onFilter: (filteredItems: storeItem[]) => void;
}

const FilterBar = ({ items, onFilter }: FilterBarProps) => {
  const [ searchParams, setSearchParams ] = useState({ term: "", filters: {} })
  
};

export default FilterBar;