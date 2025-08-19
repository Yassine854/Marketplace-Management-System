import PaymentMethodTable from "../table/PaymentMethodTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import CreateMethodModal, {
  useGetAllMethods,
} from "../components/CreateMethodModel";
import { Methods } from "@/types/Methods";
import { useMethodsActions } from "../hooks/useMethodActions";
import EditMethodModal from "../components/EditMethodModel";
import axios from "axios";

const PaymentMethodPage = () => {
  const { Methods: methods, isLoading, error, refetch } = useGetAllMethods();
  const {
    editMethod,
    deleteMethod,
    isLoading: isActionLoading,
    error: actionError,
  } = useMethodsActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<Methods | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleEdit = async (updatedMethod: Methods) => {
    try {
      const result = await editMethod(updatedMethod.id, updatedMethod);
      if (result) {
        refetch();
      }
    } catch (error) {
      // Optionally handle error
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMethod(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (method: Methods) => {
    setSelectedMethod(method);
    setIsEditModalOpen(true);
  };

  const handleCreate = async (name: string) => {
    try {
      setIsCreating(true);
      setCreateError(null);
      const response = await axios.post(
        "/api/marketplace/payment_method/create",
        { name },
      );
      if (response.status === 201 || response.status === 200) {
        refetch();
      }
    } catch (err) {
      setCreateError("Failed to create method");
    } finally {
      setIsCreating(false);
    }
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
              Payment Methods
            </h1>
            <p className="text-sm text-gray-600">Manage your payment methods</p>
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

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn flex items-center gap-2"
              title="Add new method"
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
              <span className="hidden sm:inline">Add Method</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <PaymentMethodTable
            methods={methods}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            isSidebarOpen={false}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Create Modal */}
      <CreateMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name) => {
          handleCreate(name);
          setIsModalOpen(false);
        }}
      />
      {/* Edit Modal */}
      {isEditModalOpen && selectedMethod && (
        <EditMethodModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(id, name) => {
            handleEdit({ id, name });
            setIsEditModalOpen(false);
          }}
          id={selectedMethod.id}
          initialName={selectedMethod.name}
        />
      )}
    </div>
  );
};

export default PaymentMethodPage;
