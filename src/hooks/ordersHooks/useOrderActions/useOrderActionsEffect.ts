import { useEffect } from "react";
import { useOrdersData } from "../../queries/orderQuries/useOrdersData";
import { useOrdersCount } from "../../queries/orderQuries/useOrdersCount";

export const useOrderActionsEffect = ({
  reset,
  isPending,
  isEditingPending,
  isCancelingPending,
  setOrderUnderActionId,
}: any) => {
  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useOrdersCount();

  useEffect(() => {
    if (!isCancelingPending && !isEditingPending) {
      reset();
      refetch();
      refetchCount();
    }
  }, [isEditingPending, isCancelingPending, refetchCount, refetch, reset]);

  useEffect(() => {
    if (!isPending && !isCancelingPending) {
      setOrderUnderActionId && setOrderUnderActionId("");
    }
  }, [
    refetch,
    isPending,
    refetchCount,
    isEditingPending,
    isCancelingPending,
    setOrderUnderActionId,
  ]);
};
