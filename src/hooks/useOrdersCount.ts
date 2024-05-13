import { useEffect, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";

export const useOrdersCount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: openOrders, isLoading: isOpenLoading } = useGetOrders({
    status: "open",
    page: 1,
    perPage: 10,
    search: "",
    sortBy: "",
  });

  const { data: validOrders, isLoading: isValidLoading } = useGetOrders({
    status: "valid",
    page: 1,
    perPage: 10,
    sortBy: "",
    search: "",
  });

  const { data: readyOrders, isLoading: isReadyLoading } = useGetOrders({
    status: "shipped",
    page: 1,
    perPage: 10,
    search: "",
    sortBy: "",
  });

  useEffect(() => {
    if (isOpenLoading || isValidLoading || isReadyLoading) {
      setIsLoading(true);
    }
    setIsLoading(false);
  }, [isOpenLoading, isValidLoading, isReadyLoading]);

  return {
    isLoading,
    openOrdersCount: openOrders?.totalOrders || 0,
    validOrdersCount: validOrders?.totalOrders || 0,
    readyOrdersCount: readyOrders?.totalOrders || 0,
  };
};
