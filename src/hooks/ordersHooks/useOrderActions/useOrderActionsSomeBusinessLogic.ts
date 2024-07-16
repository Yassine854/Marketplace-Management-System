import { useEffect, useState } from "react";
import { useOrdersStore } from "@/stores/ordersStore";
import { useGeneratePickList } from "../../mutations/orderMutations/useGeneratePickList";
import { useEditOrderDetails } from "../../mutations/orderMutations/useEditOrderDetails";
import { useGenerateDeliveryNote } from "../../mutations/orderMutations/useGenerateDeliveryNote";
import { useEditOrderStatusAndState } from "../../mutations/orderMutations/useEditOrderStatusAndState";

export const useOrderActionsSomeBusinessLogic = () => {
  const {
    status,
    orderOnReviewId,
    setOrderOnReviewId,
    orderOnReviewItems,
    orderOnReviewDeliveryDate,
  } = useOrdersStore();

  const { editDetails, isPending: isEditingDetailsPending } =
    useEditOrderDetails();

  const { editStatusAndState, isPending: isEditStatusPending } =
    useEditOrderStatusAndState();

  const { generatePickList, isPending: isGeneratePickListPending } =
    useGeneratePickList();

  const { generateDeliveryNote, isPending: isGenerateDeliveryNotePending } =
    useGenerateDeliveryNote();

  const [isPending, setIsPending] = useState(false);
  const [orderToCancelId, setOrderToCancelId] = useState("");
  const [isEditingPending, setIsEditingPending] = useState(false);
  const [orderUnderActionId, setOrderUnderActionId] = useState<string>("");

  useEffect(() => {
    if (isEditingDetailsPending || isEditStatusPending) {
      setIsEditingPending(true);
    } else {
      setIsEditingPending(false);
    }
  }, [isEditingDetailsPending, isEditStatusPending, setIsEditingPending]);

  useEffect(() => {
    if (
      isEditingPending ||
      isGeneratePickListPending ||
      isGenerateDeliveryNotePending
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [
    setIsPending,
    isEditingPending,
    isGeneratePickListPending,
    isGenerateDeliveryNotePending,
  ]);

  return {
    status,
    isPending,
    editDetails,
    orderOnReviewId,
    orderToCancelId,
    generatePickList,
    isEditingPending,
    orderUnderActionId,
    setOrderOnReviewId,
    orderOnReviewItems,
    editStatusAndState,
    setOrderToCancelId,
    generateDeliveryNote,
    setOrderUnderActionId,
    orderOnReviewDeliveryDate,
  };
};
