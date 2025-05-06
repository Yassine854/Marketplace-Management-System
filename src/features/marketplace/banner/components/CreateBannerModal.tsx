import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (bannerData: { altText?: string; image: File | null }) => void;
}

const CreateBannerModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateBannerModalProps) => {
  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");

  const handleSubmit = () => {
    if (!imageFile) {
      setImageError("Please select an image file");
      return;
    }

    const bannerData = {
      altText: altText.trim() || undefined,
      image: imageFile,
    };

    onCreate(bannerData);
    resetForm();
  };

  const resetForm = () => {
    setAltText("");
    setImageFile(null);
    setImageError("");
  };

  if (!isOpen) return null;

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

        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Create New Banner
        </h2>

        <div className="mb-4">
          <label
            htmlFor="altText"
            className="block text-sm font-medium text-gray-700"
          >
            Alt Text
          </label>
          <input
            id="altText"
            type="text"
            placeholder="Enter alt text for accessibility"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="bannerImage"
            className="block text-sm font-medium text-gray-700"
          >
            Banner Image *
          </label>
          <input
            id="bannerImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] || null);
              setImageError("");
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
          />
          {imageError && (
            <p className="mt-1 text-sm text-red-500">{imageError}</p>
          )}
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBannerModal;
