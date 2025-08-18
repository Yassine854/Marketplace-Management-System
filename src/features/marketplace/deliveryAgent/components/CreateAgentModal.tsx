import { useState } from "react";
import { Agent } from "@/types/agent";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Omit<Agent, "id">) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const CreateAgentModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
  error,
}: CreateAgentModalProps) => {
  const [form, setForm] = useState<Partial<Agent>>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    telephone: "",
    address: "",
    password: "",
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill all required fields");
      return;
    }
    if (form.password && form.password !== passwordConfirmation) {
      alert("Passwords don't match");
      return;
    }
    try {
      await onCreate(form as Omit<Agent, "id">);
      onClose();
    } catch (err) {
      console.error("Error creating agent:", err);
    }
  };

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
              Create New Agent
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

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <form
            id="agentCreateForm"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Personal Information */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Personal Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Phone Number"
                    value={form.telephone || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Account Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="username"
                    placeholder="Username"
                    value={form.username || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    name="address"
                    placeholder="Address"
                    value={form.address || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="passwordConfirmation"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full rounded-xl border p-3"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
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
              form="agentCreateForm"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Agent"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAgentModal;
