import { useState, useEffect } from "react";
import { Setting } from "@/types/settings";
import axios from "axios";

interface EditSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updatedSetting: Setting) => void;
  setting: Setting;
}

const EditSettingModal = ({
  isOpen,
  onClose,
  onEdit,
  setting,
}: EditSettingModalProps) => {
  const [updatedSetting, setUpdatedSetting] = useState<Setting>(setting);
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

  useEffect(() => {
    setUpdatedSetting(setting);
  }, [setting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedSetting({
      ...updatedSetting,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatedSetting({
      ...updatedSetting,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onEdit(updatedSetting);
    onClose();
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
          Edit Setting
        </h2>

        <div className="space-y-5">
          {/* Partner */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">Partner</label>
            <div className="sm:col-span-2">
              <select
                name="partnerId"
                value={updatedSetting.partnerId}
                onChange={handleSelectChange}
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
                name="deliveryType"
                value={updatedSetting.deliveryType}
                onChange={handleSelectChange}
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
                name="deliveryTypeAmount"
                placeholder="Amount"
                value={updatedSetting.deliveryTypeAmount}
                onChange={handleInputChange}
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
                name="freeDeliveryAmount"
                placeholder="Enter amount"
                value={updatedSetting.freeDeliveryAmount}
                onChange={handleInputChange}
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
                name="loyaltyPointsAmount"
                placeholder="Points"
                value={updatedSetting.loyaltyPointsAmount}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="loyaltyPointsUnique"
                placeholder="Unique Points"
                value={updatedSetting.loyaltyPointsUnique}
                onChange={handleInputChange}
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
              className="rounded bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSettingModal;
