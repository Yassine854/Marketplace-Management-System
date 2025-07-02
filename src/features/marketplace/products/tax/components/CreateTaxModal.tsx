import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CreateTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taxData: { value: number }) => void;
}

const CreateTaxModal = ({ isOpen, onClose, onCreate }: CreateTaxModalProps) => {
  const [value, setValue] = useState<string>("");
  const [valueError, setValueError] = useState("");

  const handleSubmit = () => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      setValueError("Please enter a valid tax value");
      return;
    }
    onCreate({ value: parsedValue });
    resetForm();
  };

  const resetForm = () => {
    setValue("");
    setValueError("");
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
          Create New Tax
        </h2>

        <div className="mb-4">
          <label
            htmlFor="taxValue"
            className="block text-sm font-medium text-gray-700"
          >
            Tax Value *
          </label>
          <input
            id="taxValue"
            type="number"
            placeholder="Enter tax value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {valueError && (
            <p className="mt-1 text-sm text-red-500">{valueError}</p>
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

export default CreateTaxModal;
