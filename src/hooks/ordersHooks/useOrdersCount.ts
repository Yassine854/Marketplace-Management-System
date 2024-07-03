import { useEffect, useState } from "react";

import { useGetOrders } from "@/hooks/queries/useGetOrders";
import { useOrdersStore } from "@/stores/ordersStore";
export const useOrdersCount = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { storeId } = useOrdersStore();

  const {
    data: openOrders,
    isLoading: isOpenLoading,
    refetch: r1,
  } = useGetOrders({
    page: 1,
    perPage: 1,
    search: "",
    sortBy: "",
    filterBy: storeId ? `status:=open  && storeId:=${storeId}` : "status:=open",
  });

  const {
    data: validOrders,
    isLoading: isValidLoading,
    refetch: r2,
  } = useGetOrders({
    page: 1,
    perPage: 1,
    sortBy: "",
    search: "",
    filterBy: storeId ? `status:=valid && storeId:=${storeId}` : "status:valid",
  });

  const {
    data: readyOrders,
    isLoading: isReadyLoading,
    refetch: r3,
  } = useGetOrders({
    page: 1,
    perPage: 1,
    search: "",
    sortBy: "",
    filterBy: storeId
      ? `status:=shipped && storeId:=${storeId}`
      : "status:shipped",
  });

  useEffect(() => {
    if (isOpenLoading || isValidLoading || isReadyLoading) {
      setIsLoading(true);
    }
    setIsLoading(false);
  }, [isOpenLoading, isValidLoading, isReadyLoading]);

  const handleRefetch = () => {
    r1();
    r2();
    r3();
  };

  return {
    refetch: handleRefetch,
    isLoading,
    openOrdersCount: openOrders?.totalOrders || 0,
    validOrdersCount: validOrders?.totalOrders || 0,
    readyOrdersCount: readyOrders?.totalOrders || 0,
  };
};
