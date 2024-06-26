import { onPDFIconClick } from "./onPDFIconClick";
import { onOrderClick } from "./onOrderClick";
import { onGeneratePickListClick } from "./onGeneratePickListClick";
import { useOrdersStore } from "@/stores/ordersStore";
import { onGenerateDeliveryNotesClick } from "./onGenerateDeliveryNotesClick";
import { useNavigation } from "@/hooks/useNavigation";
import { useState } from "react";

export const useOrdersActions = () => {
  const { navigateToOrderDetails, navigateToManageMilkRun } = useNavigation();
  const { selectedOrders } = useOrdersStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rowActions = [
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

  const toolbarActions = [
    {
      name: "Generate Pick List",
      key: "picklist",
      action: async () => {
        setIsLoading(true);
        await onGeneratePickListClick(selectedOrders);
        setIsLoading(false);
      },
    },
    {
      name: "Generate Delivery Note",
      key: "delivery-note",
      action: async () => {
        setIsLoading(true);
        await onGenerateDeliveryNotesClick(selectedOrders);
        setIsLoading(false);
      },
    },
    {
      name: "Manage Milk-Runs",
      key: "mr",
      action: () => {
        navigateToManageMilkRun();
      },
    },
  ];
  return {
    onPDFIconClick,
    onOrderClick,
    onGeneratePickListClick,
    rowActions,
    toolbarActions,
    isLoading,
  };
};
