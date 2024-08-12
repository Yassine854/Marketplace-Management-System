import { useEffect, useState } from "react";
import { useGeneratePickList } from "./mutations/oneOrder/useGeneratePickList";
import { useEditOrderDetails } from "./mutations/oneOrder/useEditOrderDetails";
import { useGenerateDeliveryNote } from "./mutations/oneOrder/useGenerateDeliveryNote";
import { useChangeOrderStatus } from "./mutations/oneOrder/useChangeOrderStatus";
import { useGenerateOrderSummary } from "@/features/orders/hooks/mutations/oneOrder/useGenerateOrderSummary";

export const useOrderMutations = () => {
  const { editDetails, isPending: isEditingDetailsPending } =
    useEditOrderDetails();

  const { editStatusAndState, isPending: isEditStatusPending } =
    useChangeOrderStatus();

  const { generateSummary, isPending: isGenerateSummaryPending } =
    useGenerateOrderSummary();

  const { generatePickList, isPending: isGeneratePickListPending } =
    useGeneratePickList();

  const { generateDeliveryNote, isPending: isGenerateDeliveryNotePending } =
    useGenerateDeliveryNote();

  const [isSomeMutationPending, setIsSomeMutationPending] = useState(false);

  useEffect(() => {
    if (
      isEditStatusPending ||
      isEditingDetailsPending ||
      isGenerateSummaryPending ||
      isGeneratePickListPending ||
      isGenerateDeliveryNotePending
    ) {
      setIsSomeMutationPending(true);
    } else {
      setIsSomeMutationPending(false);
    }
  }, [
    isEditStatusPending,
    isEditingDetailsPending,
    isGenerateSummaryPending,
    isGeneratePickListPending,
    isGenerateDeliveryNotePending,
  ]);

  return {
    editDetails,
    generateSummary,
    generatePickList,
    editStatusAndState,
    generateDeliveryNote,
    isSomeMutationPending,
  };
};
