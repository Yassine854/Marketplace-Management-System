import { useOrderActionsFunctions } from "./useOrderActionsFunctions";

export const useOrderDetailsActionsByStatus = () => {
  const {
    edit,
    cancel,
    summary,
    pickList,
    setToValid,
    setToUnpaid,
    setToArchived,
    setBackToOpen,
    setToDelivered,
    setBackToValid,
    setToReadyToShip,
  } = useOrderActionsFunctions();

  const actions = {
    valid: [edit, setToReadyToShip, setBackToOpen, cancel, pickList, summary],
    shipped: [edit, setToUnpaid, setBackToValid, cancel, pickList, summary],
    failed: [pickList, summary],
    closed: [pickList, summary],
    archived: [pickList, summary],
    unpaid: [setToDelivered, pickList, summary],
    delivered: [setToArchived, pickList, summary],
    open: [edit, setToValid, cancel, pickList, summary],
  };

  return {
    //@ts-ignore
    actions,
  };
};
