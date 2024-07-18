import { useGenerateMultipleDeliveryNotes } from "../mutations/useGenerateMultipleDeliveryNotes";
import { useEffect, useRef, useState } from "react";
import { useOrdersStore } from "@/features/orderManagement/stores/ordersStore";
import { multipleOrdersActionsByStatus } from "./multipleOrdersActionsByStatus";
import { useEditOrdersStatusesAndStates } from "../mutations/useEditMultipleOrdersStatusesAndStates";
import { useDisclosure } from "@nextui-org/react";
import { useCancelMultipleOrders } from "../mutations/useCancelMultipleOrders";
import { useGenerateMultiplePickLists } from "../mutations/useGenerateMultiplePickLists";

export const useMultipleOrdersActions = () => {
  const actionsRef = useRef(null);

  const reset = () => {
    if (actionsRef.current) {
      //@ts-ignore
      actionsRef.current.reset();
    }
  };

  const { status, selectedOrders } = useOrdersStore();
  const { editStatusesAndStates, isPending: isEditingPending } =
    useEditOrdersStatusesAndStates();

  const { cancelOrdersAsync, isPending: isCancelingPending } =
    useCancelMultipleOrders();

  const { generatePickLists, isPending: isGeneratingPickListPending } =
    useGenerateMultiplePickLists();

  const { generateDeliveryNotes, isPending: isGenerateDeliveryNotePending } =
    useGenerateMultipleDeliveryNotes();

  const {
    isOpen: isCancelingModalOpen,
    onOpen: openCancelingModal,
    onOpenChange,
    onClose,
  } = useDisclosure();

  const [isPending, setIsPending] = useState(false);

  const cancelOrders = async () => {
    await cancelOrdersAsync(selectedOrders);

    onClose();
  };

  const actions = multipleOrdersActionsByStatus({
    editStatusesAndStates,
    generatePickLists,
    selectedOrders,
    generateDeliveryNotes,
    openCancelingModal,
  });

  useEffect(() => {
    if (
      isEditingPending ||
      isGeneratingPickListPending ||
      isGenerateDeliveryNotePending
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
      reset();
    }
  }, [
    isEditingPending,
    isGeneratingPickListPending,
    isGenerateDeliveryNotePending,
  ]);

  return {
    //@ts-ignore
    actions: status ? actions[status] : actions["all"],
    isPending,
    isCancelingModalOpen,
    openCancelingModal,
    onOpenChange,
    onClose,
    isCancelingPending,
    cancelOrders,
    generatePickLists,
    actionsRef,
  };
};
