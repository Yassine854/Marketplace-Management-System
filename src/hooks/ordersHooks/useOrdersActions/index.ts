import { onPDFIconClick } from "./onPDFIconClick";
import { onOrderClick } from "./onOrderClick";
import { onGeneratePickListClick } from "./onGeneratePickListClick";
import { useOrdersStore } from "@/stores/ordersStore";

export const useOrdersActions = () => {
  const {} = useOrdersStore();

  const tableRowActions = [
    {
      name: "Edit",
      key: "edit",
      action: (orderId: any) => {
        console.log("Edit");
      },
    },
    {
      name: "Generate Pick List",
      key: "picklist",
      action: (orderId: string) => {
        console.log("Pick");
        onGeneratePickListClick([orderId]);
      },
    },
    {
      name: "Print BL's",
      key: "bl",
      action: (orderId: string) => {
        console.log("BL");
      },
    },
    {
      name: "Manage Milk-Runs",
      key: "mr",
      action: (orderId: string) => {
        console.log("MILK");
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
