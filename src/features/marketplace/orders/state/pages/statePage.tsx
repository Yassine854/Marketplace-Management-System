import StateTable from "../table/stateTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllStates } from "../hooks/useGetAllStates";
import { useStateActions } from "../hooks/useStateActions";
import { useCreateState } from "../hooks/useCreateState";
import CreateStateModal from "../components/CreateStateModal";
import EditStateModal from "../components/EditStateModal";
import { State } from "@/types/state";

const StatePage = () => {
  const { state, isLoading, error, refetch } = useGetAllStates();
  const {
    editState,
    deleteState,
    isLoading: isActionLoading,
    error: actionError,
  } = useStateActions();
  const {
    createState,
    isLoading: isCreating,
    error: createError,
  } = useCreateState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const handleEdit = async (id: string, updatedState: State) => {
    try {
      const result = await editState(id, updatedState);
      if (result) {
        refetch();
      }
    } catch (error) {
      // Optionally handle error
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteState(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (stateObj: State) => {
    setSelectedState(stateObj);
    setIsEditModalOpen(true);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "100px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold capitalize text-gray-900">
              State
            </h1>
            <p className="text-sm text-gray-600">Manage your states</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Loading/Error Status */}
            {(isActionLoading || isCreating) && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            )}

            {(actionError || createError) && (
              <div className="rounded bg-red-50 px-3 py-1 text-sm text-red-700">
                {actionError || createError}
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn flex items-center gap-2"
              title="Add new state"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
              <span className="hidden sm:inline">Add State</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <StateTable
            state={state}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            isSidebarOpen={false}
            onEdit={(_id, updatedState) => openEditModal(updatedState)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateStateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name) => {
          createState(name, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedState && (
        <EditStateModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, name) => {
            handleEdit(id, { id, name });
            setIsEditModalOpen(false);
          }}
          id={selectedState.id}
          initialName={selectedState.name}
        />
      )}
    </div>
  );
};

export default StatePage;
