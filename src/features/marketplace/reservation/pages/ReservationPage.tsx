import ReservationDataTable from "../table/ReservationTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllReservations } from "../hooks/useGetAllReservations";
import { Reservation } from "@/features/marketplace/reservation/types/reservation";
import { useReservationActions } from "../hooks/useReservationActions";
import EditReservationModal from "../components/EditReservationModal";

const ReservationPage = () => {
  const { reservations, isLoading, error, refetch } = useGetAllReservations();

  const {
    editReservation,
    deleteReservation,
    toggleReservationStatus,
    isLoading: isActionLoading,
    error: actionError,
  } = useReservationActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const handleEdit = async (
    id: string,
    updatedReservation: Partial<Reservation> & { isActive?: boolean },
  ) => {
    try {
      const result = await editReservation(id, updatedReservation);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing reservation:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteReservation(id);
    if (result) {
      refetch();
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const result = await toggleReservationStatus(id, isActive);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error toggling reservation status:", error);
    }
  };

  const openEditModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
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
              Reservations
            </h1>
            <p className="text-sm text-gray-600">
              Manage customer reservations
            </p>
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
          <ReservationDataTable
            reservations={reservations}
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
      {isEditModalOpen && selectedReservation && (
        <EditReservationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(updatedReservation) => {
            handleEdit(updatedReservation.id, updatedReservation);
            setIsEditModalOpen(false);
          }}
          initialData={selectedReservation}
        />
      )}
    </div>
  );
};

export default ReservationPage;
