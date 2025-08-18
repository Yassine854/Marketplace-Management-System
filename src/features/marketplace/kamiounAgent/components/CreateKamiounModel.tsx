import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { roles } from "@/features/users/staticRoles";
import { Customer } from "@/types/customer"; // kept to preserve props typing compatibility with current page usage

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (customer: Omit<Customer, "id">) => Promise<boolean>; // not used anymore, preserved for compatibility
  isLoading?: boolean;
  error?: string | null;
}

// Form shape for creating a User
type CreateUserForm = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string; // agent type selected from dropdown (roles list)
};

const CreateCustomerModal = ({
  isOpen,
  onClose,
  // onCreate,
  isLoading,
  error,
}: CreateCustomerModalProps) => {
  const [form, setForm] = useState<CreateUserForm>({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    roleId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (
      !form.username.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.password.trim() ||
      !form.roleId.trim()
    ) {
      setLocalError("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/users/createUser", {
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        roleId: form.roleId,
      });
      toast.success("Agent created successfully");
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create user";
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
        className="relative my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Create User</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          {(error || localError) && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {localError || error}
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
            {/* User Information */}
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                User Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Agent Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  >
                    <option value="">Select Agent Type</option>
                    {roles.map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
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
              form="userForm"
              disabled={isLoading || submitting}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              {isLoading || submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateCustomerModal;
