"use client";

import { useEffect, useState } from "react";

import AdvancedSearch from "@/components/widgets/AdvancedSearch";
import Box from "@/components/widgets/Box";
import OrdersTable from "@/components/widgets/OrdersTable";
import OrdersTable2 from "@/components/widgets/OrdersTable2";
import OrdersTemplate from "@/components/templates/OrdersTemplate";
import { useNavigation } from "@/hooks/useNavigation";

const OrdersPage = () => {
  const [isAdvanced, setAdvanced] = useState(true);
  const { status } = useNavigation();

  return <OrdersTemplate />;
};

export default OrdersPage;
