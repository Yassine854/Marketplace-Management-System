import { onPDFIconClick } from "./onPDFIconClick";
import { onOrderClick } from "./onOrderClick";
import { onGeneratePickListClick } from "./onGeneratePickListClick";
import { useOrdersStore } from "@/stores/ordersStore";
import { onGenerateDeliveryNotesClick } from "./onGenerateDeliveryNotesClick";
import { useNavigation } from "@/hooks/useNavigation";

export const useOrdersActions = () => {
  const { navigateToOrderDetails, navigateToManageMilkRun } = useNavigation();
  const {} = useOrdersStore();

  const tableRowActions = [
    {
      name: "Edit",
      key: "edit",
      action: (orderId: any) => {
        navigateToOrderDetails();
      },
    },
    {
      name: "Generate Pick List",
      key: "picklist",
      action: (orderId: string) => {
        onGeneratePickListClick([orderId]);
      },
    },
    {
      name: "Generate Delivery Note",
      key: "delivery-note",
      action: (orderId: string) => {
        onGenerateDeliveryNotesClick([orderId]);
      },
    },
    {
      name: "Manage Milk-Runs",
      key: "mr",
      action: (orderId: string) => {
        navigateToManageMilkRun();
      },
    },
  ];

  return {
    onPDFIconClick,
    onOrderClick,
    onGeneratePickListClick,
    tableRowActions,
  };
};
