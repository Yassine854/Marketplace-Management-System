import CustomerTable from "../table/KamiounTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User } from "@/types/user";
import { useGetAllKamiounAgents } from "../hooks/useGetAllKamiounAgents";
import { useKamiounActions } from "../hooks/useKamiounActions";
import { useCreateKamiounAgent } from "../hooks/useCreateKamioun";
import CreateCustomerModal from "../components/CreateKamiounModel";
import EditCustomerModal from "../components/EditKamiounModel";

const KamiounPage = () => {
  const { users, isLoading, error, refetch } = useGetAllKamiounAgents();
  const {
    editUser,
    editUserStatus,
    isLoading: isActionLoading,
    error: actionError,
  } = useKamiounActions();
  const {
    createUser,
    isLoading: isCreating,
    error: createError,
  } = useCreateKamiounAgent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    let result = users.filter((u) => {
      const searchContent =
        `${u.username} ${u.firstName} ${u.lastName}`.toLowerCase();
      return searchContent.includes("");
    });
    return result;
  }, [users]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
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
              Kamioun Agents
            </h1>
            <p className="text-sm text-gray-600">Manage agent accounts</p>
          </div>

          <div className="flex items-center gap-3">
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
              title="Add new user"
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
              <span className="hidden sm:inline">Add Agent</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <CustomerTable
            customer={users as any}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={(id: string, u: any) => {
              const found = users.find((c) => c.id === id);
              if (found) openEditModal(found);
            }}
            onDelete={async (id: string) => {
              const user = users.find((u) => u.id === id);
              if (!user) return;
              try {
                await axios.delete("/api/users/deleteUser", {
                  data: { username: user.username },
                });
                toast.success("Agent deleted successfully");
                await refetch();
              } catch (err: any) {
                const msg =
                  err?.response?.data?.message || "Failed to delete user";
                toast.error(msg);
              }
            }}
          />
        </div>
      </div>

      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
        onCreate={async () => true}
        isLoading={isCreating}
        error={createError}
      />

      {isEditModalOpen && selectedUser && (
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            refetch();
          }}
          onEdit={async () => true}
          customer={selectedUser as any}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default KamiounPage;
