import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Brand {
  id: string;
  img: string;
  name: string | null;
}

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (brandData: {
    id: string;
    name: string;
    image?: File | null;
  }) => void;
  initialData: Brand | null;
}

const EditBrandModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}: EditBrandModalProps) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCurrentImageUrl(initialData.img);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) return;
    if (!name.trim()) return;
    const brandData = {
      id: initialData.id,
      name: name.trim(),
      image: imageFile,
    };
    onEdit(brandData);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">Edit Brand</h2>

        <div className="mb-4">
          <label
            htmlFor="brandName"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Name
          </label>
          <input
            id="brandName"
            type="text"
            placeholder="Enter brand name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="brandImage"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Logo
          </label>
          {currentImageUrl && (
            <div className="mb-2">
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={currentImageUrl}
                  alt={name || "Current brand logo"}
                  className="max-h-32 rounded border object-contain"
                />
              </div>
            </div>
          )}
          <input
            id="brandImage"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBrandModal;
