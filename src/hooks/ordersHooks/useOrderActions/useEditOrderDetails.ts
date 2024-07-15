import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { magento } from "@/libs/magento";
import { axios } from "@/libs/axios";

const formatUnixTimestamp = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000); // Convert from seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useEditOrderDetails = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ orderId, items, deliveryDate }: any) => {
      const magentoItems: any[] = [];

      items.forEach((item: any) => {
        magentoItems.push({ item_id: item.is, weight: item.shipped });
      });

      await magento.editOrderDetails({
        orderId,
        deliveryDate: formatUnixTimestamp(deliveryDate),
        items: magentoItems,
      });
      await axios.servicesClient.put("/api/orders/typesense/edit-order", {
        order: {
          id: orderId,
          items,
          deliveryDate,
          // total,
        },
      });
    },
    onSuccess: () => {
      toast.success(`Order Status Updated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { editDetails: mutate, isPending };
};
