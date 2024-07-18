import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useOrderDetailsStore } from "@/features/orderManagement/stores/orderDetailsStore";
import { useOrderDetailsEffect } from "./useOrderDetailsEffect";
import { useGetOrder } from "@/features/orderManagement/hooks/queries/useGetOrder";
import { useEffect } from "react";

export const useOrderDetailsPage = () => {
  const { navigateBack } = useNavigation();
  // const dropRef = useRef();

  const {
    total,
    isInEditMode,
    orderOnReviewId,
    orderOnReviewItems,
    setOrderOnReviewDeliveryDate,
    selectedAction,
    setIsInEditMode,
  } = useOrderDetailsStore();

  const { data: order } = useGetOrder(orderOnReviewId);

  // const reset = () => {
  //   //@ts-ignore
  //   dropRef.current && dropRef.current?.reset();
  // };

  // useEffect(() => {
  //   if (isInEditMode && dropRef.current) {
  //     //@ts-ignore
  //     dropRef.current?.changeSelected({ key: "edit", name: "Edit" });
  //   }
  // }, [isInEditMode, dropRef.current]);

  useEffect(() => {
    if (selectedAction?.key === "edit") {
      setIsInEditMode(true);
    } else {
      // setIsInEditMode(false);
    }
  }, [selectedAction, setIsInEditMode]);

  useOrderDetailsEffect();

  return {
    order,
    total,
    //  dropRef,
    isInEditMode,
    orderOnReviewItems,
    onArrowClick: navigateBack,
    onDeliveryDateChange: setOrderOnReviewDeliveryDate,
  };
};
