"use client";

import OpenOrdersTemplate from "@/components/templates/OpenOrdersTemplate";
import { useEffect } from "react";
import { useGetOrders } from "@/hooks/queries/useGetOrders";

const OpenOrdersPage = () => {
  const { data, isLoading, error } = useGetOrders({
    status: "open",
    page: 1,
    perPage: 10,
  });

  return <OpenOrdersTemplate orders={data?.orders} total={data?.total} />;
};

export default OpenOrdersPage;
