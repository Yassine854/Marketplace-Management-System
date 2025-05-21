import { useState } from "react";
import { Agent } from "@/types/agent";
import { motion } from "framer-motion";
import { X, User, Lock, Mail, Phone, Home, Key } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="max-h-screen w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <User size={20} />
              Create New Agent
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 transition-colors hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              <X size={16} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="First Name"
                  required
                />
                <User
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Last Name"
                  required
                />
                <User
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Email Address"
                required
              />
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Phone Number"
                />
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Username"
                  required
                />
                <Key
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Address"
              />
              <Home size={18} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Password"
                  required
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Confirm Password"
                  required
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-medium text-white transition-all hover:to-indigo-700 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
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
                  "Create Agent"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAgentModal;
