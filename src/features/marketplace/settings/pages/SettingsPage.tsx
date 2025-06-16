import { useState } from "react";
import { useGetAllSettings } from "../hooks/useGetAllSettings";
import { useSettingsActions } from "../hooks/useSettingsActions";
import { useCreateSetting } from "../hooks/useCreateSettings";
import SettingsTable from "../table/settingsTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import CreateSettingModal from "../components/CreateSettingsModal";
import EditSettingModal from "../components/EditSettingsModal";
import { Setting } from "@/types/settings";

const SettingsPage = () => {
  const { settings, isLoading, error, refetch } = useGetAllSettings();
  const {
    editSetting,
    deleteSetting,
    isLoading: isActionLoading,
    error: actionError,
  } = useSettingsActions();
  const {
    createSetting,
    isLoading: isCreating,
    error: createError,
  } = useCreateSetting();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleEdit = async (updatedSetting: Setting) => {
    const result = await editSetting(updatedSetting.id, updatedSetting);
    if (result) {
      refetch();
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSetting(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (setting: Setting) => {
    setSelectedSetting(setting);
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
              Settings
            </h1>
            <p className="text-sm text-gray-600">
              Manage your delivery and loyalty settings
            </p>
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
              title="Add new setting"
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
              <span className="hidden sm:inline">Add Setting</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <SettingsTable
            settings={settings}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateSettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(newSetting) => {
          createSetting(newSetting, () => {
            refetch();
            setIsModalOpen(false);
          });
        }}
      />

      {isEditModalOpen && selectedSetting && (
        <EditSettingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEdit}
          setting={selectedSetting}
        />
      )}
    </div>
  );
};

export default SettingsPage;
