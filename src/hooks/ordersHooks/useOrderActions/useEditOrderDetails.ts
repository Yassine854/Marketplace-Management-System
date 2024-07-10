import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
//import { magento } from "@/libs/magento";
import { axios } from "@/libs/axios";

export const useEditOrderDetails = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ orderId, items, deliveryDate }: any) => {
      let total = 0;

      items.forEach((item: any) => {
        total += item?.totalPrice;
      });

      await axios.servicesClient.put("/api/orders/typesense/edit-order", {
        order: {
          id: orderId,
          items,
          deliveryDate,
          total,
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
