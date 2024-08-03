import {
  useOrdersData,
  useOrdersSelection,
  useOrdersSorting,
} from "@/features/orders/hooks";
import { useDisclosure } from "@nextui-org/modal";

export const useOrdersTable = () => {
  const { onClose, onOpen, isOpen } = useDisclosure();

  const { orders, isLoading } = useOrdersData();

  const { changeSelectedSort } = useOrdersSorting();

  const { isAllOrdersSelected, selectAllOrders, selectOrder } =
    useOrdersSelection();

  return {
    orders,
    isLoading,
    isAllOrdersSelected,
    selectAllOrders,
    selectOrder,
    changeSelectedSort,
    onClose,
  };
};
