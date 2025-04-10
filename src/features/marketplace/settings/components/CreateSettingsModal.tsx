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

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newSetting: Setting = {
      id: "",
      deliveryType,
      deliveryTypeAmount,
      freeDeliveryAmount,
      loyaltyPointsAmount,
      loyaltyPointsUnique,
      partnerId: partnerId || "",
    };

    onCreate(newSetting);
    setDeliveryType("");
    setDeliveryTypeAmount("");
    setFreeDeliveryAmount("");
    setLoyaltyPointsAmount("");
    setLoyaltyPointsUnique("");
    setPartnerId(null);
  };

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

        <div className="space-y-5">
          {/* Partner */}
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

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSettingModal;
