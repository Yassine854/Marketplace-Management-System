import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface CreateSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (subCategoryData: {
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => void;
  categoryId: string | null;
}

const CreateSubCategoryModal = ({
  isOpen,
  onClose,
  onCreate,
  categoryId,
}: CreateSubCategoryModalProps) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !categoryId) return;

    const subCategoryData = {
      name: trimmed,
      isActive,
      image: imageFile,
      categoryId,
    };

    onCreate(subCategoryData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setIsActive(true);
    setImageFile(null);
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
              Create Subcategory
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
            id="subCategoryCreateForm"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="subCategoryName"
                  className="mb-1 block font-medium text-gray-700"
                >
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="subCategoryName"
                  type="text"
                  placeholder="Enter subcategory name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center gap-3 rounded-xl border p-3">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="isActive" className="text-gray-700">
                    Active Subcategory
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="subCategoryImage"
                  className="mb-1 block font-medium text-gray-700"
                >
                  Subcategory Image
                </label>
                <input
                  id="subCategoryImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:hover:bg-blue-700"
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
              form="subCategoryCreateForm"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Create Subcategory
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateSubCategoryModal;
