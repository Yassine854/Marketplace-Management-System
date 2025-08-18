import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface EditProductStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, newName: string, actif: boolean) => void;
  id: string;
  initialName: string;
  initialActif: boolean;
}

const EditProductStatusModal: React.FC<EditProductStatusModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  id,
  initialName,
  initialActif,
}) => {
  const [name, setName] = useState(initialName);
  const [actif, setActif] = useState(initialActif);

  useEffect(() => {
    setName(initialName);
    setActif(initialActif);
  }, [initialName, initialActif]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onEdit(id, trimmed, actif);
    onClose();
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
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Product Status
            </h2>
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
          <form
            id="productStatusEditForm"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border p-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Status name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Active
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="status-active-edit"
                    type="checkbox"
                    checked={actif}
                    onChange={() => setActif(!actif)}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor="status-active-edit" className="text-gray-700">
                    Mark status as active
                  </label>
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
              form="productStatusEditForm"
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

export default EditProductStatusModal;
