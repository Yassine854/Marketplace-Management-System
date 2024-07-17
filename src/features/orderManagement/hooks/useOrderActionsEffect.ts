import { useEffect } from "react";
import { useOrderActionsStore } from "@/stores/orderActionsStore";
import { useOrdersData } from "./queries/useOrdersData";
import { useOrdersCount } from "./queries/useOrdersCount";

export const useOrderActionsEffect = ({ reset }: any): void => {
  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useOrdersCount();

  const {
    isPending,
    isEditingPending,
    isSomeActionPending,
    setOrderUnderActionId,
  } = useOrderActionsStore();

  useEffect(() => {
    if (!isSomeActionPending) {
      setOrderUnderActionId && setOrderUnderActionId("");
    }
  }, [
    refetch,
    isPending,
    refetchCount,
    isEditingPending,
    isSomeActionPending,
    setOrderUnderActionId,
  ]);

  useEffect(() => {
    if (!isEditingPending) {
      reset();
      refetch();
      refetchCount();
    }
  }, [isEditingPending, refetchCount, refetch, reset]);
};
