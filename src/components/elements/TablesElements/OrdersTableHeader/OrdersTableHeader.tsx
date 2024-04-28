"use client";

import Dropdown from "@/components/elements/sharedElements/Dropdown";
import { Props } from "./OrdersTableHeader.types";
import SearchBar from "@/components/elements/TablesElements/SearchBar";
import { useState } from "react";

const OrdersTableHeader = ({
  title,
  sortOptions,
  sortBy,
  setSortBy,
  setSearch,
}: any) => {
  return (
    <div className="bb-dashed flex h-20 w-full flex-wrap items-center justify-between gap-3 bg-n10 p-4">
      <p className="text-xl font-bold capitalize">{title}</p>
      <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar handleSearch={setSearch} />
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap">Sort By : </p>
          <Dropdown
            selected={sortBy}
            setSelected={setSortBy}
            items={sortOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersTableHeader;
