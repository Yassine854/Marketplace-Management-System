import { useMilkRunStore } from "@/stores/milkRunStore";
import { useGetDeliveryAgents } from "./useGetDeliveryAgents";
import { useGetMilkRunOrders } from "./useGetMilkRunOrders";
import { useEffect, useState } from "react";

export const useMilkRun = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    setSelectedOrdersIds,
    selectedOrdersIds,
    setDeliveryDate,
    deliveryDate,
  } = useMilkRunStore();

  const { deliveryAgents, isLoading: isDeliveryAgentsLoading } =
    useGetDeliveryAgents();

  const { orders, isLoading: isOrdersLoading } =
    useGetMilkRunOrders(deliveryDate);

  const onOrderMarkerClick = (orderId: string) => {
    console.log("🚀 ~ onOrderMarkerClick ~ orderId:", orderId);
    let list = selectedOrdersIds;

    const index = list.indexOf(orderId);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(orderId);
    }

    setSelectedOrdersIds(list);
  };

  const onDeliveryDateChange = (date: any) => {
    setDeliveryDate(date);
  };

  useEffect(() => {
    if (isDeliveryAgentsLoading || isOrdersLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isDeliveryAgentsLoading, isOrdersLoading, setIsLoading]);

  return {
    orders,
    deliveryAgents,
    onOrderMarkerClick,
    selectedOrdersIds,
    deliveryDate,
    isLoading,
    onDeliveryDateChange,
  };
};
