import { useState, useEffect } from "react";
import { SubCategory } from "@/types/subCategory";

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (subCategoryData: {
    id: string;
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => void;
  initialData: SubCategory | null;
  categoryId: string | null;
}

const EditSubCategoryModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
  categoryId,
}: EditSubCategoryModalProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIsActive(initialData.isActive ?? true);
      // Note: Existing image handling might need additional logic for display
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !categoryId || !initialData) return;

    const subCategoryData = {
      id: initialData.id,
      name: name.trim(),
      isActive,
      image: imageFile,
      categoryId,
    };

    onEdit(subCategoryData);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setIsActive(true);
    setImageFile(null);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Edit Subcategory
        </h2>

        {/* Subcategory Name Input */}
        <div className="mb-4">
          <label
            htmlFor="subCategoryName"
            className="block text-sm font-medium text-gray-700"
          >
            Subcategory Name
          </label>
          <input
            id="subCategoryName"
            type="text"
            placeholder="Enter subcategory name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Active Status Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
            Active Subcategory
          </label>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label
            htmlFor="subCategoryImage"
            className="block text-sm font-medium text-gray-700"
          >
            Update Subcategory Image
          </label>
          <input
            id="subCategoryImage"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
          />
          {initialData.image && !imageFile && (
            <p className="mt-2 text-sm text-gray-500">
              Current image: {initialData.image}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubCategoryModal;
