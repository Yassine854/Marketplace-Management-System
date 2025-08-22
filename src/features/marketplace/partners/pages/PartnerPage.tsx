import PartnerTable from "../table/PartnerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState, useEffect } from "react";
import { useGetAllPartners } from "../hooks/useGetAllPartners";
import { Partner } from "@/types/partner";
import { usePartnerActions } from "../hooks/usePartnerActions";
import { useCreatePartner } from "../hooks/useCreatePartner";
import CreatePartnerModal from "../components/CreatePartnerModal";
import EditPartnerModal from "../components/EditPartnerModal";

interface TypePartner {
  id: string;
  name: string;
}
interface Role {
  id: string;
  name: string;
}

const PartnerPage = () => {
  const { partners, isLoading, error, refetch } = useGetAllPartners();
  const {
    editPartner,
    deletePartner,
    isLoading: isActionLoading,
    error: actionError,
  } = usePartnerActions();
  const {
    createPartner,
    isLoading: isCreating,
    error: createError,
  } = useCreatePartner();

  const [typePartners, setTypePartners] = useState<TypePartner[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Fetch typePartners and roles data
  useEffect(() => {
    const fetchTypePartners = async () => {
      try {
        const response = await fetch("/api/marketplace/typePartner/getAll");
        const data = await response.json();
        setTypePartners(data.typePartners);
      } catch (error) {
        console.error("Error fetching type partners:", error);
        setTypePartners([]);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/marketplace/roles/getAll");
        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchTypePartners();
    fetchRoles();
  }, []);

  const handleEdit = async (id: string, updatedPartner: Partial<Partner>) => {
    try {
      const result = await editPartner(id, {
        ...updatedPartner,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      });
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing partner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deletePartner(id);
    if (result) {
      refetch();
    }
  };

  const openEditModal = (partner: Partner) => {
    setSelectedPartner(partner);
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
              Partners
            </h1>
            <p className="text-sm text-gray-600">Manage your partners</p>
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
              title="Add new partner"
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
              <span className="hidden sm:inline">Add Partner</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <PartnerTable
            partners={partners}
            isLoading={isLoading}
            error={error}
            refetch={async () => {
              await refetch();
            }}
            onEdit={openEditModal}
            onDelete={handleDelete}
            typePartners={typePartners}
          />
        </div>
      </div>

      {/* Modals */}
      <CreatePartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (partnerData) => {
          try {
            await createPartner(partnerData);
            refetch();
            setIsModalOpen(false);
          } catch (error) {
            console.error("Error creating partner:", error);
          }
        }}
        typePartners={typePartners}
        roles={roles}
      />

      {isEditModalOpen && selectedPartner && (
        <EditPartnerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={(updatedData) => handleEdit(selectedPartner.id, updatedData)}
          partner={selectedPartner}
          typePartners={typePartners}
          roles={roles}
        />
      )}
    </div>
  );
};

export default PartnerPage;
