import { useState, useEffect } from "react";
import { Setting } from "@/types/settings";
import axios from "axios";

interface CreateSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newSetting: Setting) => void;
}

const CreateSettingModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateSettingModalProps) => {
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
    { day: string; startTime: string; endTime: string }[]
  >([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDeliveryType("");
      setDeliveryTypeAmount("");
      setFreeDeliveryAmount("");
      setLoyaltyPointsAmount("");
      setLoyaltyPointsUnique("");
      setPartnerId(null);
      setSchedules([]);
      setFormError(null);
    }
  }, [isOpen]);

  const handleAddSchedule = () => {
    const usedDays = schedules.map((s) => s.day);
    const nextDay = joursDisponibles.find((day) => !usedDays.includes(day));
    if (nextDay) {
      setSchedules([
        ...schedules,
        { day: nextDay, startTime: "", endTime: "" },
      ]);
    }
  };

  const handleScheduleChange = (
    index: number,
    field: "day" | "startTime" | "endTime",
    value: string,
  ) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
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

  const validateForm = () => {
    if (!partnerId) {
      setFormError("Please select a partner");
      return false;
    }
    if (!deliveryType || !deliveryTypeAmount) {
      setFormError("Please fill in delivery type and amount");
      return false;
    }
    if (schedules.length === 0) {
      setFormError("Please add at least one schedule");
      return false;
    }
    if (schedules.some((s) => !s.startTime || !s.endTime)) {
      setFormError("Please fill in all schedule times");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newSetting: Setting = {
      id: "",
      deliveryType,
      deliveryTypeAmount,
      freeDeliveryAmount,
      loyaltyPointsAmount,
      loyaltyPointsUnique,
      partnerId: partnerId || "",
      schedules,
    };

    onCreate(newSetting);
  };

  if (!isOpen) return null;

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
          Add Setting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {formError && (
            <div className="rounded-lg bg-red-100 p-3 text-red-700">
              {formError}
            </div>
          )}

          {/* Partner Selection */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">Partner</label>
            <div className="sm:col-span-2">
              <select
                value={partnerId ?? ""}
                onChange={(e) => setPartnerId(e.target.value)}
                disabled={loadingPartners}
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {loadingPartners ? "Loading..." : "Select a partner"}
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
              Delivery
            </label>
            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Type
                </option>
                <option value="Fixe">Fixe</option>
                <option value="par KM">par KM</option>
              </select>
              <input
                type="text"
                placeholder="Amount"
                value={deliveryTypeAmount}
                onChange={(e) => setDeliveryTypeAmount(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Free Delivery */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">
              Free Delivery From
            </label>
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Enter amount"
                value={freeDeliveryAmount}
                onChange={(e) => setFreeDeliveryAmount(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">Loyalty</label>
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <input
                type="text"
                placeholder="Points Amount"
                value={loyaltyPointsAmount}
                onChange={(e) => setLoyaltyPointsAmount(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Unique Points"
                value={loyaltyPointsUnique}
                onChange={(e) => setLoyaltyPointsUnique(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value="1 DT"
                readOnly
                className="w-full cursor-not-allowed rounded border border-gray-300 bg-gray-100 p-2 text-sm"
              />
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
                  {/* Day Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
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

                  {/* Time Inputs */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">
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
                    <label className="text-sm font-medium text-gray-600">
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

                  {/* Remove Button */}
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

          {/* Form Buttons */}
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSettingModal;
