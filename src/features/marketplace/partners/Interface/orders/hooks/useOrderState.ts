import { useState, useCallback } from "react";
import { OrderContext } from "../states/OrderContext";
import { OrderWithRelations } from "../types/order";
import { OrderStateType } from "../states/OrderState";

export const useOrderState = (initialOrder: OrderWithRelations) => {
  const [orderContext] = useState(() => new OrderContext());
  const [currentOrder, setCurrentOrder] = useState(initialOrder);

  const updateOrder = useCallback(
    async (updatedOrder: OrderWithRelations) => {
      try {
        await orderContext.updateOrder(updatedOrder);
        setCurrentOrder(updatedOrder);
      } catch (error) {
        console.error("Error updating order:", error);
        throw error;
      }
    },
    [orderContext],
  );

  const deleteOrder = useCallback(
    async (orderId: string) => {
      try {
        await orderContext.deleteOrder(orderId);
      } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
      }
    },
    [orderContext],
  );

  const canTransitionTo = useCallback(
    (nextState: OrderStateType): boolean => {
      return orderContext.canTransitionTo(nextState);
    },
    [orderContext],
  );

  const getAvailableActions = useCallback((): string[] => {
    return orderContext.getAvailableActions();
  }, [orderContext]);

  return {
    currentOrder,
    updateOrder,
    deleteOrder,
    canTransitionTo,
    getAvailableActions,
    currentState: orderContext.getState().name,
  };
};
