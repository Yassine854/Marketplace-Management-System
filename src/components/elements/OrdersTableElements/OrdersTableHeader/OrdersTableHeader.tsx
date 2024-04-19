"use client";

import Dropdown from "@/components/elements/sharedElements/Dropdown";
import { Props } from "./OrdersTableHeader.types";
import SearchBar from "@/components/elements/OrdersTableElements/SearchBar";
import { useState } from "react";

const options = ["Total", "Delivery Date"];

const OrdersTableHeader = ({ handleSearch }: Props) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="bb-dashed mb-6 flex w-full flex-wrap items-center justify-between gap-3 pb-6">
      <p className="font-medium">Open Orders</p>
      <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
        <SearchBar handleSearch={handleSearch} />
        <div className="flex shrink-0 items-center gap-2">
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
