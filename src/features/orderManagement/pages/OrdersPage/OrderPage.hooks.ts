import {
  useOrdersData,
  useOrdersCount,
  useMultipleOrdersActions,
} from "@/features/orderManagement/hooks";
import { useEffect } from "react";

export const useOrdersPage = () => {
  const { refetch } = useOrdersData();

  const { orders } = useOrdersData();

  const { refetch: refetchCount } = useOrdersCount();

  const {
    isPending,
    cancelOrders,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  } = useMultipleOrdersActions();

  useEffect(() => {
    if (!isPending || !isCancelingPending) {
      refetch();
      refetchCount();
    }
  }, [isPending, isCancelingPending, refetchCount, refetch]);

  return {
    orders,
    cancelOrders,
    isCancelingPending,
    isCancelingModalOpen,
    onCancelingModalClose,
  };
};
