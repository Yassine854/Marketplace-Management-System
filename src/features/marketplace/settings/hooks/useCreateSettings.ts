import { useState } from "react";
import axios from "axios";
import { Setting } from "@/types/settings"; // Ensure you import the Setting type

export function useCreateSetting() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSetting = async (newSetting: Setting, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      // Pass the entire `newSetting` object, not just the name
      const response = await axios.post("/api/marketplace/settings/create", {
        ...newSetting, // Spread the setting to send the full object
      });

      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Error while creating the setting");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createSetting, isLoading, error };
}
