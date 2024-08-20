import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useMilkRunStore } from "@/features/delivery/stores/milkRunStore";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useOrdersTableStore } from "@/features/orders/stores/ordersTableStore";

export const useResetStores = () => {
  const resetOrdersTableStore = useOrdersTableStore(
    (state: any) => state.reset,
  );

  const resetOrderActionsStore = useOrderActionsStore(
    (state: any) => state.reset,
  );

  const resetOrderDetailsStore = useOrderDetailsStore(
    (state: any) => state.reset,
  );

  const resetOrdersStore = useOrdersStore((state: any) => state.reset);

  const resetMilkRunStore = useMilkRunStore((state: any) => state.reset);

  const resetAllStores = () => {
    resetOrdersStore();
    resetMilkRunStore();
    resetOrdersTableStore();
    resetOrderActionsStore();
    resetOrderDetailsStore();
  };

  return resetAllStores;
};
