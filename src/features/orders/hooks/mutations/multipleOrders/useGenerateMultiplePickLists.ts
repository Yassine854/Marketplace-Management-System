import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { axios } from "@/libs/axios";

export const useGenerateMultiplePickLists = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (ordersIds: string[]) => {
      const { data } = await axios.servicesClient.post(
        "/api/orders/generatePickLists",
        {
          ordersIds,
        },
      );
      const pickListUrl = data?.url;
      return pickListUrl;
    },
    onSuccess: (pickListUrl) => {
      window.open(pickListUrl);
      toast.success(`Pick Lists Generated Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return { generatePickLists: mutate, isPending };
};
