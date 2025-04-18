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

    // Basic validation
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill all required fields");
      return;
    }

    // Password confirmation validation (only if password is changed)
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Create Agent</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="tel"
            name="telephone"
            placeholder="Phone"
            value={form.telephone || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password || ""}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-green-400"
            >
              {isLoading ? "Creating..." : "Create Agent"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateAgentModal;
