import { useEffect, useState } from "react";
import { useGeneratePickList } from "./mutations/oneOrder/useGeneratePickList";
import { useEditOrderDetails } from "./mutations/oneOrder/useEditOrderDetails";
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

  const [isSomeMutationPending, setIsSomeMutationPending] = useState(false);

  useEffect(() => {
    if (
      isEditStatusPending ||
      isEditingDetailsPending ||
      isGenerateSummaryPending ||
      isGeneratePickListPending
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
  ]);

  return {
    editDetails,
    generateSummary,
    generatePickList,
    editStatusAndState,
    isSomeMutationPending,
  };
};
