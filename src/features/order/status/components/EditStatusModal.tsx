import { useState, useEffect } from "react";
import { useGetAllStates } from "../../state/hooks/useGetAllStates";
import { useStatusActions } from "../hooks/useStatusActions";

interface Status {
  id: string;
  name: string;
  stateId: string;
}

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: Status | null;
  onSave: (updatedStatus: Status) => void;
}

const EditStatusModal = ({
  isOpen,
  onClose,
  status,
  onSave,
}: EditStatusModalProps) => {
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const { editStatus, isLoading } = useStatusActions();
  const { state: states } = useGetAllStates();

  useEffect(() => {
    if (isOpen && status) {
      setName(status.name);
      setStateId(status.stateId);
    }
  }, [isOpen, status]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !status) return null;

  const handleUpdate = async () => {
    if (!name.trim() || !stateId) return;
    const updatedStatus = { id: status.id, name: name.trim(), stateId };
    await editStatus(status.id, updatedStatus); // Mise à jour du statut
    onSave(updatedStatus); // Appel de la fonction onSave pour rafraîchir la liste des statuts
    onClose(); // Fermer la modal après modification
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-[400px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Edit Status</h2>

        <input
          type="text"
          placeholder="Nom du statut"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border p-2"
        />

        <select
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
          className="mt-2 w-full rounded-lg border p-2"
        >
          <option value="">Select state</option>
          {states?.map((state: { id: string; name: string }) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModal;
