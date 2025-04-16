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
      // 1. Create the main Setting
      const settingResponse = await axios.post(
        "/api/marketplace/settings/create",
        {
          deliveryType: newSetting.deliveryType,
          deliveryTypeAmount: newSetting.deliveryTypeAmount,
          freeDeliveryAmount: newSetting.freeDeliveryAmount,
          loyaltyPointsAmount: newSetting.loyaltyPointsAmount,
          loyaltyPointsUnique: newSetting.loyaltyPointsUnique,
          partnerId: newSetting.partnerId || null,
        },
      );

      if (settingResponse.status === 201) {
        const settingId = settingResponse.data.settings.id;

        // 2. Create each schedule
        const schedulePromises = newSetting.schedules.map((schedule) =>
          axios.post("/api/marketplace/settings_schedule/create", {
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            settingId: settingId,
          }),
        );

        await Promise.all(schedulePromises);
        onSuccess?.();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to create setting and schedules",
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createSetting, isLoading, error };
}
