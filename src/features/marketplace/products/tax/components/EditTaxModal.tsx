import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Tax {
  id: string;
  value: number;
}

interface EditTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (taxData: { id: string; value: number }) => void;
  initialData: Tax | null;
}

const EditTaxModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}: EditTaxModalProps) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setValue(initialData.value.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;
    const taxData = {
      id: initialData.id,
      value: parsedValue,
    };
    onEdit(taxData);
    setValue("");
    onClose();
  };

  if (!isOpen || !initialData) return null;

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
            <h2 className="text-2xl font-bold text-gray-800">Edit Tax</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <form id="taxEditForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="taxValue"
                  className="mb-1 block font-medium text-gray-700"
                >
                  Tax Value <span className="text-red-500">*</span>
                </label>
                <input
                  id="taxValue"
                  type="number"
                  step="any"
                  placeholder="Enter tax value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full rounded-xl border p-3"
                  required
                />
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
              form="taxEditForm"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditTaxModal;
