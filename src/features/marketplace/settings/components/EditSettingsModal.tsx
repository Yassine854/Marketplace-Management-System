import { useState, useEffect } from "react";
import { Setting } from "@/types/settings";
import axios from "axios";

interface EditSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedSetting: Setting) => void;
  setting: Setting | null;
}

const EditSettingModal = ({
  isOpen,
  onClose,
  onEdit,
  setting,
}: EditSettingModalProps) => {
  const [deliveryType, setDeliveryType] = useState("");
  const [deliveryTypeAmount, setDeliveryTypeAmount] = useState("");
  const [freeDeliveryAmount, setFreeDeliveryAmount] = useState("");
  const [loyaltyPointsAmount, setLoyaltyPointsAmount] = useState("");
  const [loyaltyPointsUnique, setLoyaltyPointsUnique] = useState("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partners, setPartners] = useState<{ id: string; username: string }[]>(
    [],
  );
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const joursDisponibles = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const [schedules, setSchedules] = useState<
    { id?: string; day: string; startTime: string; endTime: string }[]
  >([]);

  // Initialize state from setting data
  useEffect(() => {
    if (setting) {
      setDeliveryType(setting.deliveryType);
      setDeliveryTypeAmount(setting.deliveryTypeAmount);
      setFreeDeliveryAmount(setting.freeDeliveryAmount);
      setLoyaltyPointsAmount(setting.loyaltyPointsAmount);
      setLoyaltyPointsUnique(setting.loyaltyPointsUnique);
      setPartnerId(setting.partnerId || null);
      setSchedules(setting.schedules || []);
    }
  }, [setting]);

  const handleAddSchedule = () => {
    const usedDays = schedules.map((s) => s.day);
    const nextDay = joursDisponibles.find((day) => !usedDays.includes(day));
    if (!nextDay) return;

    setSchedules([
      ...schedules,
      {
        day: nextDay,
        startTime: "",
        endTime: "",
      },
    ]);
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("/api/marketplace/partners/getAll");
        setPartners(response.data.partners);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoadingPartners(false);
      }
    };

    if (isOpen) fetchPartners();
  }, [isOpen]);

  const handleRemoveSchedule = async (index: number) => {
    const scheduleToRemove = schedules[index];
    if (!scheduleToRemove.id) {
      setSchedules(schedules.filter((_, i) => i !== index));
      return;
    }

    setIsProcessing(true);
    try {
      await axios.delete(
        `/api/marketplace/settings_schedule/${scheduleToRemove.id}`,
      );
      setSchedules(schedules.filter((_, i) => i !== index));
    } catch (error) {
      setFormError("Failed to remove schedule");
      console.error("Delete schedule error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateForm = () => {
    if (!partnerId) {
      setFormError("Please select a partner");
      return false;
    }
    if (!deliveryType || !deliveryTypeAmount) {
      setFormError("Please fill in delivery type and delivery amount");
      return false;
    }
    if (schedules.length === 0) {
      setFormError("Please maintain at least one schedule");
      return false;
    }
    if (schedules.some((s) => !s.startTime || !s.endTime)) {
      setFormError("Please fill in all schedule start and end times");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleScheduleChange = async (
    index: number,
    field: "day" | "startTime" | "endTime",
    value: string,
  ) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;

    // If schedule already exists, update via API
    if (newSchedules[index].id) {
      try {
        await axios.patch(
          `/api/marketplace/settings_schedule/${newSchedules[index].id}`,
          {
            [field]: value,
          },
        );
      } catch (error) {
        setFormError("Failed to update schedule");
        console.error("Update schedule error:", error);
        return;
      }
    }

    setSchedules(newSchedules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !setting) return;

    try {
      setIsProcessing(true);

      // Filter schedules that don't have an id (new schedules)
      const newSchedules = schedules.filter((s) => !s.id);
      for (const s of newSchedules) {
        // Call the API to create the schedule.
        await axios.post("/api/marketplace/settings_schedule/create", {
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          settingId: setting.id,
        });
      }

      // Construct the updated setting object
      const updatedSetting: Setting = {
        ...setting,
        deliveryType,
        deliveryTypeAmount,
        freeDeliveryAmount,
        loyaltyPointsAmount,
        loyaltyPointsUnique,
        partnerId: partnerId || "",
        schedules,
      };

      // Pass updated setting and close modal
      onEdit(updatedSetting);
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      setFormError("Failed to save new schedules");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !setting) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        style={{ maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Edit Setting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="rounded-lg bg-red-100 p-3 text-red-700">
              {formError}
            </div>
          )}

          {/* Partner Selection */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">
              Partner Name
            </label>
            <div className="sm:col-span-2">
              <select
                value={partnerId ?? ""}
                onChange={(e) => setPartnerId(e.target.value)}
                disabled={loadingPartners}
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {loadingPartners ? "Loading partners..." : "Select partner"}
                </option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Type + Amount */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">
              Delivery Details
            </label>
            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Delivery Type
                </label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option disabled value="">
                    Select Type
                  </option>
                  <option value="Fixe">Fixe</option>
                  <option value="par KM">par KM</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Delivery Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={deliveryTypeAmount}
                  onChange={(e) => setDeliveryTypeAmount(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Free Delivery */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">
              Free Delivery Threshold
            </label>
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Enter free delivery amount"
                value={freeDeliveryAmount}
                onChange={(e) => setFreeDeliveryAmount(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">
              Loyalty Points
            </label>
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Points Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter points amount"
                  value={loyaltyPointsAmount}
                  onChange={(e) => setLoyaltyPointsAmount(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Unique Points
                </label>
                <input
                  type="text"
                  placeholder="Enter unique points"
                  value={loyaltyPointsUnique}
                  onChange={(e) => setLoyaltyPointsUnique(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Fixed Rate
                </label>
                <input
                  type="text"
                  value="1 DT"
                  readOnly
                  className="w-full cursor-not-allowed rounded border border-gray-300 bg-gray-100 p-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Schedules Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-600">
              Schedules
            </label>
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-md"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Day
                    </label>
                    <select
                      value={schedule.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {joursDisponibles
                        .filter(
                          (day) =>
                            !schedules.some(
                              (s, i) => s.day === day && i !== index,
                            ),
                        )
                        .map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(index)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {schedules.length < 7 && (
              <button
                type="button"
                onClick={handleAddSchedule}
                className="ml-4 inline-flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Add Schedule
              </button>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSettingModal;
