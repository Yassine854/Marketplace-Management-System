import { useState } from "react";
import { axios } from "@/libs/axios";
import { VendorOrder } from "../hooks/useGetAllOrders";
import { toast } from "react-hot-toast";
import { useAuth } from "@/shared/hooks/useAuth";

export function useOrderActions() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editOrder = async (
    id: string,
    updatedOrder: Partial<VendorOrder> & {
      itemsSnapshot?: any[];
      stateId?: string;
      statusId?: string;
    },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/vendorOrder/${id}`,
        {
          itemsSnapshot: updatedOrder.itemsSnapshot,
          stateId: updatedOrder.stateId,
          statusId: updatedOrder.statusId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        toast.success("VendorOrder updated successfully");
        return response.data.vendorOrder;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update vendor order";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating vendor order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.id) throw new Error("No partnerId found in session");
      const response = await axios.servicesClient.delete(
        `/api/marketplace/vendorOrder/${id}`,
      );
      if (response.status === 200) {
        toast.success("Order deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete order";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderStatus = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/vendorOrder/${id}`,
        { isActive },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        const statusText = isActive ? "activated" : "deactivated";
        toast.success(`Order ${statusText} successfully`);
        return response.data.order;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update order status";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating order status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendorOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.get(
        `/api/marketplace/vendorOrder/${id}`,
      );
      if (response.status === 200) {
        return response.data.vendorOrder;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch vendor order";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching vendor order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPartner = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.id) throw new Error("No user id found in session");
      const response = await axios.servicesClient.get(
        `/api/marketplace/partners/${user.id}`,
      );
      if (response.status === 200) {
        return response.data.partner;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch partner data";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching partner data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editOrder,
    deleteOrder,
    toggleOrderStatus,
    fetchVendorOrder,
    fetchPartner,
    isLoading,
    error,
  };
}
