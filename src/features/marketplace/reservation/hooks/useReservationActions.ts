import { useState } from "react";
import { axios } from "@/libs/axios";
import { Reservation } from "@/features/marketplace/reservation/types/reservation";
import { toast } from "react-hot-toast";

export function useReservationActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editReservation = async (
    id: string,
    updatedReservation: Partial<Reservation> & { isActive?: boolean },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/reservation/${id}`,
        updatedReservation,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Reservation updated successfully");
        return response.data.reservation;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update reservation";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating reservation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReservation = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/reservation/${id}`,
      );
      if (response.status === 200) {
        toast.success("Reservation deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete reservation";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting reservation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReservationStatus = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.patch(
        `/api/marketplace/reservation/${id}`,
        { isActive },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        const statusText = isActive ? "activated" : "deactivated";
        toast.success(`Reservation ${statusText} successfully`);
        return response.data.reservation;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update reservation status";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating reservation status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editReservation,
    deleteReservation,
    toggleReservationStatus,
    isLoading,
    error,
  };
}
