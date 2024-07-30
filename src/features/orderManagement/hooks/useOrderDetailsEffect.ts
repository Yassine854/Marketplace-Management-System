import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderActionsStore } from "@/features/orderManagement/stores/orderActionsStore";

export const useOrderDetailsEffect = () => {
  const { selectedAction } = useOrderActionsStore();
  const { orderOnReviewId, setIsInEditMode } = useOrderDetailsStore();

  useEffect(() => {
    if (selectedAction && selectedAction?.key === "edit") {
      setIsInEditMode(true);
    } else {
      setIsInEditMode(false);
    }
  }, [selectedAction, setIsInEditMode]);

  useEffect(() => {
    !orderOnReviewId && redirect("/orders");
  }, [orderOnReviewId]);
};
