import { useDisclosure } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useCancelMultipleOrders } from "../mutations/multipleOrders/useCancelMultipleOrders";
import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useMultipleOrdersActionsByStatus } from "./useMultipleOrdersActionsByStatus";
import { useGenerateMultiplePickLists } from "../mutations/multipleOrders/useGenerateMultiplePickLists";
import { useGenerateMultipleDeliveryNotes } from "../mutations/multipleOrders/useGenerateMultipleDeliveryNotes";
import { useChangeMultipleOrdersStatuses } from "../mutations/multipleOrders/useChangeMultipleOrdersStatuses";

export const useMultipleOrdersActions = () => {
  const actionsRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const { status, selectedOrders } = useOrdersStore();

  const { cancelMultipleOrdersAsync, isPending: isCancelingPending } =
    useCancelMultipleOrders();

  const { editStatusesAndStates, isPending: isEditingPending } =
    useChangeMultipleOrdersStatuses();

  const { generatePickLists, isPending: isGeneratingPickListPending } =
    useGenerateMultiplePickLists();

  const { generateDeliveryNotes, isPending: isGenerateDeliveryNotePending } =
    useGenerateMultipleDeliveryNotes();

  const cancelMultipleOrders = async () => {
    await cancelMultipleOrdersAsync(selectedOrders);
    onClose();
  };

  const reset = () => {
    //@ts-ignore
    actionsRef.current && actionsRef.current.reset();
  };

  const actions = useMultipleOrdersActionsByStatus({
    selectedOrders,
    generatePickLists,
    generateDeliveryNotes,
    editStatusesAndStates,
    openCancelingModal: onOpen,
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

  useEffect(() => {
    !isCancelingPending && reset();
  }, [isCancelingPending]);

  return {
    isPending,
    actionsRef,
    cancelMultipleOrders,
    generatePickLists,
    isCancelingPending,
    isCancelingModalOpen: isOpen,
    onCancelingModalClose: onClose,
    //@ts-ignore
    actions: status ? actions[status] : actions["all"],
  };
};
