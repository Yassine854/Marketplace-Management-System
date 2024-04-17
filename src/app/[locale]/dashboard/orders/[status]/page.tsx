"use client";

import OrdersSearchBar from "@/components/blocks/OrdersSearchBar";
import OrdersTable from "@/components/blocks/OrdersTable";
import { useState } from "react";
const OrdersPage = () => {
  const [searchBar, setSearchBar] = useState(true);

  return (
    <div className="h-[100%] w-[100%]">
      {searchBar && <OrdersSearchBar />}
      {!searchBar && <OrdersTable />}
    </div>
  );
};
export default OrdersPage;
