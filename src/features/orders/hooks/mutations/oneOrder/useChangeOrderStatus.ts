import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useGetOrder } from "../../queries/useGetOrder";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useOrderActionsStore } from "@/features/orders/stores/orderActionsStore";
import { useOrderDetailsStore } from "@/features/orders/stores/orderDetailsStore";
import { useAuth } from "@/features/shared/hooks/useAuth";
import React from "react";

export const useChangeOrderStatus = () => {
  const { refetch } = useOrdersData();
  const { isNoEditUser } = useGlobalStore();
  const { orderOnReviewId } = useOrderDetailsStore();
  const { refetch: refetchCount } = useGetOrdersCount();
  const { setOrderUnderActionId } = useOrderActionsStore();
  const { refetch: refetchOrder } = useGetOrder(orderOnReviewId);
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ orderId, status, state }: any) => {
      if (isNoEditUser) {
        toast.error("Action not allowed", { duration: 5000 });
        throw new Error("Action not allowed");
      }

      const response = await axios.servicesClient.post("api/orders/changeOrderStatus", {
        orderId,
        status,
        state,
        //@ts-ignore
        username: user?.username,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || "Something went wrong");
      }

      return orderId;
    },
    onSuccess: () => {
      refetch();
      refetchOrder();
      refetchCount();
      setOrderUnderActionId("");
      toast.success("Order Status Updated Successfully", { duration: 5000 });
    },
    onError: (error: any) => {
      setOrderUnderActionId("");
      const errorMessage = error.response?.data?.message || error.message || "Something Went Wrong";

  
      toast.custom((t) => 
        React.createElement(
          'div', 
          { style: { padding: '16px', background: 'red', color: 'white' } }, 
          [
            React.createElement('p', { key: 'message' }, errorMessage),
            React.createElement('button', {
              key: 'button',
              onClick: () => toast.dismiss(t.id),
              style: { 
                marginTop: '8px', 
                backgroundColor: 'white', 
                color: 'black', 
                border: 'none', 
                padding: '8px 16px', 
                cursor: 'pointer' 
              }
            }, 'OK')
          ]
        ),
        {
          duration: Infinity, 
        }
      );
    },
  });

  return { editStatusAndState: mutate, isPending };
};
