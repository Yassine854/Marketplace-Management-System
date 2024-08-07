import { useEffect, useState } from "react";
import { useGetManyOrders } from "./useGetManyOrders";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const useOrdersCount = () => {
  const { storeId } = useGlobalStore();

  const [isLoading, setIsLoading] = useState(false);

  const {
    refetch: r1,
    data: openOrders,
    isLoading: isOpenLoading,
  } = useGetManyOrders({
    page: 1,
    perPage: 1,
    search: "",
    sortBy: "",
    filterBy: storeId ? `status:=open  && storeId:=${storeId}` : "status:=open",
  });

  const {
    refetch: r2,
    data: validOrders,
    isLoading: isValidLoading,
  } = useGetManyOrders({
    page: 1,
    perPage: 1,
    sortBy: "",
    search: "",
    filterBy: storeId ? `status:=valid && storeId:=${storeId}` : "status:valid",
  });

  const {
    refetch: r3,
    data: readyOrders,
    isLoading: isReadyLoading,
  } = useGetManyOrders({
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
    isLoading,
    refetch: handleRefetch,
    openOrdersCount: openOrders?.totalOrders || 0,
    validOrdersCount: validOrders?.totalOrders || 0,
    readyOrdersCount: readyOrders?.totalOrders || 0,
  };
};
