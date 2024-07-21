import { useEffect } from "react";
import { useOrderDetailsActionsByStatus } from "./useOrderDetailsActionsByStatus";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";

export const useOrderDetailsActions = () => {
  const { actions } = useOrderDetailsActionsByStatus();
  const {
    isSomeActionPending,
    setOrderUnderActionId,
    orderToCancelId,
    setOrderToCancelId,
  } = useOrderActionsStore();

  useEffect(() => {
    !isSomeActionPending && setOrderUnderActionId("");
  }, [isSomeActionPending, setOrderUnderActionId]);

  return {
    setOrderToCancelId,
    orderToCancelId,
    isSomeActionPending,
    actions,
  };
};
