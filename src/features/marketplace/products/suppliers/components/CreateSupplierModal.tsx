import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useGrowthBook } from "@growthbook/growthbook-react";
import toast from "react-hot-toast";
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
  // AB Testing Setup
  const gb = useGrowthBook();
  const experiment = gb?.run({
    key: "supplier-form-layout",
    variations: [0, 1], // 0: original, 1: enhanced
  });
  const variant = experiment?.value ?? 0;

  // Experiment Tracking
  const [interactionCount, setInteractionCount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

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

  // Track time spent in modal
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => {
        setTimeSpent((prev) => {
          const newTime = prev + 1;
          if (newTime === 5) logExperimentGoal("time_5s");
          if (newTime === 15) logExperimentGoal("time_15s");
          if (newTime === 30) logExperimentGoal("time_30s");
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Log modal view when opened
  useEffect(() => {
    if (isOpen) {
      logExperimentGoal("modal_viewed");
    }
  }, [isOpen]);

  // Track form interactions
  const trackInteraction = () => {
    setInteractionCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 3) logExperimentGoal("meaningful_interaction");
      return newCount;
    });
  };

  const logExperimentGoal = async (goalName: string) => {
    try {
      await fetch("/api/marketplace/experimentLogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: "supplier-form-layout",
          variationId: variant,
          goalName,
        }),
      });
    } catch (error) {
      console.error("Error logging experiment goal:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    trackInteraction();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    logExperimentGoal("submission_started");

    // Validation
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!form.code.trim()) {
      toast.error("Supplier code is required");
      return;
    }

    try {
      await onCreate(form);
      logExperimentGoal("supplier_created");
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
    } catch (error) {
      logExperimentGoal("submission_failed");
      console.error("Error creating supplier:", error);
    }
  };

  if (!isOpen) return null;

  // Variant 1 - Enhanced layout with subtle improvements
  if (variant === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
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
          {/* Header - Enhanced with subtle gradient */}
          <div className="sticky top-0 z-10 rounded-t-2xl bg-gradient-to-r from-gray-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Supplier
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            {error && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Form Content - Enhanced with better spacing and subtle shadows */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
            <form
              id="supplierForm"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Supplier Information - Enhanced card */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-gray-800">
                  <span className="mr-2 text-blue-500">•</span>
                  Supplier Information
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Manufacturer ID
                    </label>
                    <input
                      name="manufacturerId"
                      type="number"
                      placeholder="Enter ID"
                      value={form.manufacturerId || ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Supplier Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="code"
                      placeholder="Enter code"
                      value={form.code}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="companyName"
                      placeholder="Enter company name"
                      value={form.companyName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Contact Name
                    </label>
                    <input
                      name="contactName"
                      placeholder="Enter contact name"
                      value={form.contactName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information - Enhanced card */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-gray-800">
                  <span className="mr-2 text-blue-500">•</span>
                  Contact Information
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <input
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section - Enhanced card */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-gray-800">
                  <span className="mr-2 text-blue-500">•</span>
                  Address Information
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <input
                      name="address"
                      placeholder="Enter address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Postal Code
                    </label>
                    <input
                      name="postalCode"
                      placeholder="Enter postal code"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      City
                    </label>
                    <input
                      name="city"
                      placeholder="Enter city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Country
                    </label>
                    <input
                      name="country"
                      placeholder="Enter country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-600">
                      Capital
                    </label>
                    <input
                      name="capital"
                      placeholder="Enter capital"
                      value={form.capital}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer - Enhanced with better button styling */}
          <div className="sticky bottom-0 rounded-b-2xl bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-gray-100 px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="supplierForm"
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Supplier"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Variant 0 - Original layout (with very minor tweaks)
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
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                  required
                />
                <input
                  name="code"
                  placeholder="Code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                  required
                />
                <input
                  name="companyName"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                  required
                />
                <input
                  name="contactName"
                  placeholder="Contact Name"
                  value={form.contactName}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
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
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
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
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                />
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                />
                <input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
                />
                <input
                  name="capital"
                  placeholder="Capital"
                  value={form.capital}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 focus:border-blue-500"
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
              className="rounded-lg bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300"
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
