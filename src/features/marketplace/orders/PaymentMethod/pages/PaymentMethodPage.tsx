import PaymentMethodTable from "../table/PaymentMethodTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllMethods } from "../components/CreateMethodModel";
import { Methods } from "@/types/Methods";
import { useMethodsActions } from "../hooks/useMethodActions";
import EditMethodModal from "../components/EditMethodModel";

const PaymentMethodPage = () => {
  const { Methods: methods, isLoading, error, refetch } = useGetAllMethods();
  const {
    editMethod,
    deleteMethod,
    isLoading: isActionLoading,
    error: actionError,
  } = useMethodsActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<Methods | null>(null);

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
            {isActionLoading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            )}

            {actionError && (
              <div className="rounded bg-red-50 px-3 py-1 text-sm text-red-700">
                {actionError}
              </div>
            )}
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
