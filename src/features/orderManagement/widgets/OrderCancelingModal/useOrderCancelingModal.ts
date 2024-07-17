import { useDisclosure } from "@nextui-org/react";
import { useOrderActionsStore } from "@/stores/orderActionsStore";
import { useCancelOrder } from "@/features/orderManagement/hooks/mutations/useCancelOrder";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const useOrderCancelingModal = () => {
  const { onClose, onOpenChange, onOpen, isOpen } = useDisclosure();
  const { cancelOrder, isPending, isSuccess, isError } = useCancelOrder();
  const { orderToCancelId, setOrderToCancelId } = useOrderActionsStore();

  useEffect(() => {
    orderToCancelId && onOpen();
  }, [orderToCancelId, onOpen]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Order Canceled  Successfully`, { duration: 5000 });
      setOrderToCancelId("");
      onClose();
    }
  }, [isSuccess, setOrderToCancelId, onClose]);

  useEffect(() => {
    if (isError) {
      toast.error(`Something Went Wrong`, { duration: 5000 });
      setOrderToCancelId("");
      onClose();
    }
  }, [isError, setOrderToCancelId, onClose]);

  const handelCanceling = (orderId: string) => (): void => {
    cancelOrder(orderId);
  };

  return {
    isOpen,
    onOpenChange,
    isPending,
    cancelOrder: handelCanceling(orderToCancelId),
  };
};
