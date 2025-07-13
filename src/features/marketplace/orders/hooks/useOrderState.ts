import { useState, useEffect } from "react";
import { OrderContext } from "../state/OrderContext";
import { OrderStateFactory } from "../state/OrderStateFactory";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";

export const useOrderState = (
  orderId: string,
  initialStatus: string = "new",
) => {
  const [orderContext, setOrderContext] = useState<OrderContext | null>(null);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setStatus } = useOrdersStore();

  useEffect(() => {
    const initialState = OrderStateFactory.createState(initialStatus);
    const context = new OrderContext(initialState, orderId);
    setOrderContext(context);
    setAvailableActions(context.getAvailableActions());
  }, [orderId, initialStatus]);

  const transitionTo = async (nextState: string) => {
    if (!orderContext) return false;

    setIsTransitioning(true);
    try {
      const success = await orderContext.requestTransition(nextState);
      if (success) {
        setAvailableActions(orderContext.getAvailableActions());
        setStatus(orderContext.getState().name);
      }
      return success;
    } finally {
      setIsTransitioning(false);
    }
  };

  return {
    currentState: orderContext?.getState().name,
    availableActions,
    transitionTo,
    isTransitioning,
  };
};
