import { useState } from "react";
import axios from "axios";

interface State {
  id: string;
  name: string;
}

export function useStateActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editState = async (id: string, updatedState: State) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/state/${id}`,
        updatedState,
      );
      if (response.status === 200) {
        return response.data.state;
      }
    } catch (err: any) {
      setError("Failed to update state");
      console.error("Error updating state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteState = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/state/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete state");
      console.error("Error deleting state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editState, deleteState, isLoading, error };
}
