"use client";

import { useEffect, useState } from "react";

import AdvancedSearch from "@/components/blocks/AdvancedSearch";
import Box from "@/components/blocks/Box";
import OrdersTable from "@/components/blocks/OrdersTable";
import OrdersTable2 from "@/components/blocks/OrdersTable2";
import OrdersTemplate from "@/components/templates/OrdersTemplate";
import { useNavigation } from "@/hooks/useNavigation";

const OrdersPage = () => {
  const [isAdvanced, setAdvanced] = useState(true);
  const { status } = useNavigation();

  return <OrdersTemplate />;
};

export default OrdersPage;
