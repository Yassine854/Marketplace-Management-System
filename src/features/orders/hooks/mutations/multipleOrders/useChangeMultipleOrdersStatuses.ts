import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useOrdersData } from "../../queries/useOrdersData";
import { useGetOrdersCount } from "../../queries/useGetOrdersCount";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useAuth } from "@/features/shared/hooks/useAuth";
import React from "react";

export const useChangeMultipleOrdersStatuses = () => {
  const { refetch } = useOrdersData();
  const { refetch: refetchCount } = useGetOrdersCount();
  const { isNoEditUser } = useGlobalStore();
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ ordersIds, status, state }: any) => {
      // Check if there are more than 5 orders selected
      if (ordersIds.length > 3 && status=='unpaid') {
        // Show a toast message to inform the user
        //toast.error("You have selected more than 5 orders. Sorry, you can't proceed.", { duration: 5000 });
        throw new Error("Errot , More than 3 orders selected.");
      }

      // Proceed with the mutation if the number of selected orders is valid
      if (isNoEditUser) {
        toast.error(`Action not allowed`, { duration: 5000 });
        throw new Error("User is not allowed to edit.");
      }

      // Proceed with the mutation logic
      if (status === 'unpaid') {
        const response = await axios.servicesClient.post("/api/orders/changeOrdersStatus", {
          orders: ordersIds.join(','), 
          status,
          state,
          //@ts-ignore
          username: user?.username,
        });

        if (response.status !== 200) {
          throw new Error(response.data.message || "Something went wrong");
        }
      } else {
        try {
          const response = await axios.servicesClient.post("/api/orders/changeOrdersStatus", {
            orders: ordersIds.join(','), 
            status,
            state,
            //@ts-ignore
            username: user?.username,
          });
        } catch (error) {
          // Handle error for a specific order and throw to stop further processing
          throw new Error(`Failed to update orders`);
        }
      }
    },
    onSuccess: () => {
      refetch();
      refetchCount();
      toast.success(`Orders Statuses Updated Successfully`, { duration: 5000 });
      setTimeout(() => {
        window.location.reload();
      });
    },
    onError: (error: any) => {
      // Safely extract error message
      const errorMessage = error.response?.data?.message || error.message || "Something Went Wrong";

      toast.custom((t) => 
        React.createElement(
          'div', 
          { style: { padding: '16px', background: 'red', color: 'white' } }, 
          [
            React.createElement('p', { key: 'message' }, errorMessage),
            React.createElement('button', {
              key: 'button',
              onClick: () => {
                toast.dismiss(t.id);
                window.location.reload(); // Refresh the page
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

  return { editStatusesAndStates: mutate, isPending };
};
