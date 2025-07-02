import SourceTable from "../table/SourceTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllSources } from "../hooks/useGetAllSources";
import { useSourceActions } from "../hooks/useSourceActions";
import { useCreateSource } from "../hooks/useCreateSource";
import CreateSourceModal from "../components/CreateSourceModal";
import EditSourceModal from "../components/EditSourceModal";
import { Source } from "@/types/source";

const SourcePage = () => {
  const { sources, isLoading, error, refetch } = useGetAllSources();

  const {
    editSource,
    deleteSource,
    isLoading: isActionLoading,
    error: actionError,
  } = useSourceActions();
  const {
    createSource,
    isLoading: isCreating,
    error: createError,
  } = useCreateSource();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const handleEdit = async (id: string, updatedSource: Partial<Source>) => {
    try {
      const result = await editSource(id, updatedSource);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing source:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSource(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (source: Source) => {
    setSelectedSource(source);
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
              Sources
            </h1>
            <p className="text-sm text-gray-600">Manage your sources</p>
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
              title="Add new source"
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
              <span className="hidden sm:inline">Add Source</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <SourceTable
            sources={sources}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
            isSidebarOpen={false}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(sourceData) => {
          createSource(sourceData, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedSource && (
        <EditSourceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, data) => {
            handleEdit(id, data);
            setIsEditModalOpen(false);
          }}
          id={selectedSource.id}
          initialName={selectedSource.name}
        />
      )}
    </div>
  );
};

export default SourcePage;
