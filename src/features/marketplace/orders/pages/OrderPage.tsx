import OrderDataTable from "../table/OrderTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllOrders } from "../hooks/useGetAllOrders";
import { Order } from "@/features/marketplace/orders/types/order";
import { useOrderActions } from "../hooks/useOrderActions";
import EditOrderModal from "../components/EditOrderModal";

const OrderPage = () => {
  const { orders, isLoading, error, refetch } = useGetAllOrders();

  const {
    editOrder,
    deleteOrder,
    toggleOrderStatus,
    isLoading: isActionLoading,
    error: actionError,
  } = useOrderActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleEdit = async (
    id: string,
    updatedOrder: Partial<Order> & { isActive?: boolean },
  ) => {
    try {
      const result = await editOrder(id, updatedOrder);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing order:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteOrder(id);
    if (result) {
      refetch();
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const result = await toggleOrderStatus(id, isActive);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error toggling order status:", error);
    }
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
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
              Orders
            </h1>
            <p className="text-sm text-gray-600">Manage customer orders</p>
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
          <OrderDataTable
            orders={orders}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedOrder && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(updatedOrder) => {
            handleEdit(updatedOrder.id, updatedOrder);
            setIsEditModalOpen(false);
          }}
          initialData={selectedOrder}
        />
      )}
    </div>
  );
};

export default OrderPage;
