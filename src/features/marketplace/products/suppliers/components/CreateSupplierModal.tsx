import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Manufacturer } from "../hooks/useGetAllSuppliers";

interface CreateSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (supplierData: Omit<Manufacturer, "id">) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const CreateSupplierModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
  error,
}: CreateSupplierModalProps) => {
  const [form, setForm] = useState<Omit<Manufacturer, "id">>({
    manufacturerId: 0,
    code: "",
    companyName: "",
    contactName: "",
    phoneNumber: "",
    postalCode: "",
    city: "",
    country: "",
    capital: "",
    email: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(form);
    onClose();
    setForm({
      manufacturerId: 0,
      code: "",
      companyName: "",
      contactName: "",
      phoneNumber: "",
      postalCode: "",
      city: "",
      country: "",
      capital: "",
      email: "",
      address: "",
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Supplier
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          {error && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <form id="supplierForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Information */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Supplier Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="manufacturerId"
                  type="number"
                  placeholder="Manufacturer ID"
                  value={form.manufacturerId || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="code"
                  placeholder="Code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="companyName"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="contactName"
                  placeholder="Contact Name"
                  value={form.contactName}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
              </div>
            </div>
            {/* Contact Information */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Contact Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
              </div>
            </div>
            {/* Address Section */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Address
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
                <input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
                <input
                  name="capital"
                  placeholder="Capital"
                  value={form.capital}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
              </div>
            </div>
          </form>
        </div>
        {/* Footer - Sticky Bottom */}
        <div className="sticky bottom-0 rounded-b-2xl bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="supplierForm"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Supplier"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateSupplierModal;
