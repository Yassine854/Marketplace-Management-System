import { useState, useEffect } from "react";
import { useGetAllStates } from "../../state/hooks/useGetAllStates"; // Assure-toi que le chemin est correct

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, stateId: string) => void;
}

const CreateStatusModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateStatusModalProps) => {
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");

  const { state: states, isLoading, error } = useGetAllStates();

  useEffect(() => {
    if (isOpen) {
      setName("");
      setStateId("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md">
      <div className="w-[400px] rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Add Status
        </h2>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-gray-600">
            Status Name
          </label>
          <input
            type="text"
            placeholder="Entrer un nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-gray-600">State</label>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading</p>
          ) : error ? (
            <p className="text-sm text-red-500">Erreur </p>
          ) : (
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              {states?.map((state: { id: string; name: string }) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!name.trim() || !stateId) return;
              onCreate(name.trim(), stateId);
              onClose();
            }}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!name.trim() || !stateId}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStatusModal;
