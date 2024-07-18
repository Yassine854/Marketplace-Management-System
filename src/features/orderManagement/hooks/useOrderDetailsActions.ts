import { useEffect } from "react";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";
import { useOrderDetailsActionsByStatus } from "./useOrderDetailsActionsByStatus";

export const useOrderDetailsActions = () => {
  const { actions } = useOrderDetailsActionsByStatus();
  const { isSomeActionPending, setOrderUnderActionId } = useOrderActionsStore();

  useEffect(() => {
    !isSomeActionPending && setOrderUnderActionId("");
  }, [isSomeActionPending, setOrderUnderActionId]);

  return {
    isSomeActionPending,
    actions,
  };
};
