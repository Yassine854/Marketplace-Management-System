import { useOrdersStore } from "@/features/orders/stores/ordersStore";
import { useOrderActionsFunctions } from "./useOrderActionsFunctions";

export const useOrderActionsByStatus = () => {
  const { status } = useOrdersStore();

  const {
    setBackToValid,
    setToUnpaid,
    setToReadyToShip,
    setBackToOpen,
    cancel,
    gotToEdit,
    pickList,
    setToArchived,
    setToDelivered,
    setToValid,
  } = useOrderActionsFunctions();

  const actions = {
    valid: [setToReadyToShip, setBackToOpen, cancel, gotToEdit, pickList],
    shipped: [setToUnpaid, setBackToValid, cancel, gotToEdit, pickList],
    failed: [pickList],
    closed: [pickList],
    archived: [pickList],
    unpaid: [setToDelivered, pickList],
    delivered: [setToArchived, pickList],
    open: [setToValid, cancel, gotToEdit, pickList],
  };

  return {
    //@ts-ignore
    actions: actions[status],
  };
};
