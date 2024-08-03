import { useEffect, useState } from "react";
import { useGeneratePickList } from "./mutations/oneOrder/useGeneratePickList";
import { useEditOrderDetails } from "./mutations/oneOrder/useEditOrderDetails";
import { useGenerateDeliveryNote } from "./mutations/oneOrder/useGenerateDeliveryNote";
import { useEditOrderStatusAndState } from "./mutations/oneOrder/useEditOrderStatusAndState";
import { useGenerateOrderSummary } from "@/features/orderManagement/hooks/mutations/oneOrder/useGenerateOrderSummary";

export const useOrderMutations = () => {
  const { editDetails, isPending: isEditingDetailsPending } =
    useEditOrderDetails();

  const { editStatusAndState, isPending: isEditStatusPending } =
    useEditOrderStatusAndState();

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
