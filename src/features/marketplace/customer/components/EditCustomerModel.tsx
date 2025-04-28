import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, formData: FormData) => Promise<void>;
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

const TUNISIA_GOVERNORATES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const EditCustomerModal = ({
  isOpen,
  customer,
  onClose,
  onEdit,
  isLoading,
  error,
}: EditCustomerModalProps) => {
  const [form, setForm] = useState<Partial<Customer> | null>(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (customer) {
      setForm({ ...customer, password: "" });
      setPasswordConfirmation("");
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setForm((prev) => ({
          ...prev!,
          [name]: files[0],
        }));
      }
    } else {
      setForm((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validate required fields
    if (
      !form.firstName?.trim() ||
      !form.lastName?.trim() ||
      !form.email?.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (form.id) {
        await onEdit(form.id, formData);
        onClose();
      }
    } catch (err) {
      console.error("Error updating customer:", err);
    }
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
            <h2 className="text-2xl font-bold text-gray-800">Edit Customer</h2>
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
          <form id="customerForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Personal Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form?.firstName || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form?.lastName || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <select
                  name="gender"
                  value={form?.gender || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form?.email || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="telephone"
                  placeholder="Phone"
                  value={form?.telephone || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <div className="space-y-3">
                  <input
                    name="password"
                    type="password"
                    placeholder="New Password (optional)"
                    value={form?.password || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />
                  {form?.password && (
                    <input
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Confirm Password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full rounded-xl border p-3"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Address Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="address"
                  placeholder="Address"
                  value={form?.address || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <select
                  name="governorate"
                  value={form?.governorate || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                >
                  <option value="">Sélectionnez un gouvernorat</option>
                  {TUNISIA_GOVERNORATES.map((governorate) => (
                    <option key={governorate} value={governorate}>
                      {governorate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business Information */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Business Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="socialName"
                  placeholder="Social Name"
                  value={form?.socialName || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
                <input
                  name="fiscalId"
                  placeholder="Fiscal ID"
                  value={form?.fiscalId || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="businessType"
                  placeholder="Business Type"
                  value={form?.businessType || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="activity1"
                  placeholder="Primary Activity"
                  value={form?.activity1 || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  required
                />
                <input
                  name="activity2"
                  placeholder="Secondary Activity"
                  value={form?.activity2 || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Required Documents
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    CIN
                    <span className="ml-1 text-xs text-gray-500">
                      - National ID Card Photo
                    </span>
                  </label>
                  {customer?.cinPhoto && (
                    <div className="mb-2">
                      <span className="text-sm">Current CIN: </span>
                      <a
                        href={customer.cinPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View CIN Photo
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    name="cinPhoto"
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    accept="image/*"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Patente Fiscale
                    <span className="ml-1 text-xs text-gray-500">
                      - Business License Photo
                    </span>
                  </label>
                  {customer?.patentPhoto && (
                    <div className="mb-2">
                      <span className="text-sm">Current Patent: </span>
                      <a
                        href={customer.patentPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Patent Photo
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    name="patentPhoto"
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    accept="image/*"
                  />
                </div>
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
              form="customerForm"
              disabled={isLoading}
              className="rounded-xl bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-green-400"
            >
              {isLoading ? "Updating..." : "Update Customer"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditCustomerModal;
