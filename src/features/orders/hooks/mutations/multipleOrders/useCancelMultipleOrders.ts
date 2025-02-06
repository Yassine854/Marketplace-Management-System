import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { useUsersStore } from "@/features/users/stores/usersStore"; 
import React from "react";

export const useCancelMultipleOrders = () => {
  const { refetch } = useOrdersData();
  const { isNoEditUser } = useGlobalStore();
  const { refetch: refetchCount } = useGetOrdersCount();
  const { user } = useAuth();
  const { userOnReviewUsername } = useUsersStore();  

  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (ordersId: string[]) => {
      if (isNoEditUser) {
        toast.error("Action not allowed", { duration: 5000 });
        throw new Error("User not allowed to edit.");
      }

      if (ordersId.length > 3) {
       // toast.error("You have selected more than 5 orders. Sorry, you can't proceed.", { duration: 5000 });
        throw new Error("Error: More than 3 orders selected.");
      }

      /*if (!userOnReviewUsername) {
        toast.error("User is not authenticated properly", { duration: 5000 });
        throw new Error("No username found");
      }*/

      await axios.servicesClient.post("/api/orders/cancelOrder", {
        orderId: ordersId,  
        username: user,
      });
    },
    onSuccess: () => {
      refetch();
      refetchCount();
      toast.success("Orders Canceled Successfully", { duration: 5000 });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Something Went Wrong";
      
      toast.custom((t: { id: any; }) => 
        React.createElement(
          'div', 
          { style: { padding: '16px', background: 'red', color: 'white' } }, 
          [
            React.createElement('p', { key: 'message' }, errorMessage),
            React.createElement('button', {
              key: 'button',
              onClick: () => {
                toast.dismiss(t.id);
                window.location.reload(); 
              },
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

  return {
    cancelMultipleOrders: mutate,
    cancelMultipleOrdersAsync: mutateAsync,
    isPending,
  };
};
