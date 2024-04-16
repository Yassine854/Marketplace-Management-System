"use client";

import Dropdown from "@/components/elements/Dropdown";
import { Props } from "./OrdersTableHeader.types";
import SearchBar from "@/components/elements/SearchBar";
import { useState } from "react";

const options = ["Name", "Price", "Rating"];

const OrdersTableHeader = ({ search }: any) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="flex flex-wrap gap-3 justify-between items-center bb-dashed mb-6 pb-6 w-full">
      <p className="font-medium">Table List View</p>
      <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar handleSearch={search} />
        <div className="flex items-center shrink-0 gap-2">
          <p className="text-xs sm:text-sm">Sort By : </p>
          <Dropdown
            selected={selected}
            setSelected={setSelected}
            items={options}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersTableHeader;
