import { useEffect, useState, useRef } from "react";
import { useMilkRunStore } from "@/stores/milkRunStore";
import { useGetDeliveryAgents } from "./useGetDeliveryAgents";
import { useGetMilkRunOrders } from "./useGetMilkRunOrders";
import { useNavigation } from "../useNavigation";
import { useOrdersStore } from "@/stores/ordersStore";

export const useMilkRun = () => {
  const {
    reset,
    setMilkRun,
    deliveryDate,
    setDeliveryDate,
    selectedOrdersIds,
    setDeliveryAgentId,
    setSelectedOrdersIds,
  } = useMilkRunStore();

  const { setOrderOnReviewId } = useOrdersStore();

  const { navigateToOrderDetails } = useNavigation();

  const { deliveryAgents, isLoading: isDeliveryAgentsLoading } =
    useGetDeliveryAgents();

  const { orders, isLoading: isOrdersLoading } =
    useGetMilkRunOrders(deliveryDate);

  const [isLoading, setIsLoading] = useState(false);

  const deliveryAgentSelectorRef = useRef(null);

  const milkRunSelectorRef = useRef(null);

  const onOrderMarkerClick = (orderId: string): void => {
    let list = selectedOrdersIds;

    const index = list.indexOf(orderId);

    index !== -1 ? list.splice(index, 1) : list.push(orderId);

    setSelectedOrdersIds(list);
  };

  const onEditClick = (orderId: string): void => {
    console.log("🚀 ~ onEditClick ~ orderId:", orderId);
    setOrderOnReviewId(orderId);
    navigateToOrderDetails();
  };
  const onReset = () => {
    reset();
    //@ts-ignore
    deliveryAgentSelectorRef?.current?.reset();
    //@ts-ignore
    milkRunSelectorRef?.current?.reset();
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
    onReset,
    isLoading,
    onEditClick,
    deliveryDate,
    deliveryAgents,
    selectedOrdersIds,
    onOrderMarkerClick,
    milkRunSelectorRef,
    deliveryAgentSelectorRef,
    onMilkRunChange: setMilkRun,
    onDeliveryDateChange: setDeliveryDate,
    onDeliveryAgentChange: setDeliveryAgentId,
  };
};
