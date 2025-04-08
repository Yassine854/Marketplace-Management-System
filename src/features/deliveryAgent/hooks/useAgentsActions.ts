import { useState } from "react";
import axios from "axios";
import { Agent } from "@/typesagent";

export function useAgentsActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editAgent = async (id: string, updatedAgent: Agent) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/agents/${id}`,
        updatedAgent,
      );
      if (response.status === 200) {
        return response.data.agent;
      }
    } catch (err: any) {
      setError("Failed to update agent");
      console.error("Error updating agent:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAgent = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/agents/${id}`);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete agent");
      console.error("Error deleting agent:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editAgent, deleteAgent, isLoading, error };
}
