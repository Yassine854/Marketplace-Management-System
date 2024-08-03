import { useEffect } from "react";
import { useOrderDetailsActionsByStatus } from "./useOrderDetailsActionsByStatus";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";

export const useOrderDetailsActions = () => {
  const { actions } = useOrderDetailsActionsByStatus();
  const { isSomeActionPending, orderToCancelId, setOrderToCancelId } =
    useOrderActionsStore();

  return {
    setOrderToCancelId,
    orderToCancelId,
    isSomeActionPending,
    actions,
  };
};
