import { useState } from "react";
import axios from "axios";

interface Status {
  id: string;
  name: string;
  stateId: string;
}

export function useStatusActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editStatus = async (id: string, updatedStatus: Status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/status/${id}`,
        updatedStatus,
      );
      if (response.status === 200) {
        // Handle success (optional: you can return the updated status)
        return response.data.status;
      }
    } catch (err: any) {
      setError("Failed to update status");
      console.error("Error updating status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a status
  const deleteStatus = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/status/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete status");
      console.error("Error deleting status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editStatus, deleteStatus, isLoading, error };
}
