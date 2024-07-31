import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrdersTableStore } from "@/features/orderManagement/stores/ordersTableStore";
import { useMilkRunStore } from "@/features/milkRunManagement/stores/milkRunStore";

export const useResetStores = () => {
  const resetOrderDetailsStore = useOrderDetailsStore(
    (state: any) => state.reset,
  );
  const resetOrdersStore = useOrdersStore((state: any) => state.reset);
  const resetOrderActionsStore = useOrderActionsStore(
    (state: any) => state.reset,
  );

  const resetOrdersTableStore = useOrdersTableStore(
    (state: any) => state.reset,
  );

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
