import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Reservation } from "@/features/marketplace/reservation/types/reservation";

export const useGetAllReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        reservations: Reservation[];
      }>("/api/marketplace/reservation/getAll");

      setReservations(data.reservations || []);
    } catch (err) {
      let errorMessage = "Failed to fetch reservations";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    isLoading,
    error,
    refetch: fetchReservations,
    isEmpty: !isLoading && !error && reservations.length === 0,
  };
};
