import AgentTable from "../table/AgentTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState } from "react";
import { useGetAllAgents } from "../hooks/useGetAllAgents";
import { Agent } from "@/types/agent";
import { useAgentsActions } from "../hooks/useAgentsActions";
import { useCreateAgent } from "../hooks/useCreateAgent";
import CreateAgentModal from "../components/CreateAgentModal";
import EditAgentModal from "../components/EditAgentModal";

const AgentPage = () => {
  const { agent: agents, isLoading, error, refetch } = useGetAllAgents();

  const {
    editAgent,
    deleteAgent,
    isLoading: isActionLoading,
    error: actionError,
  } = useAgentsActions();
  const {
    createAgent,
    isLoading: isCreating,
    error: createError,
  } = useCreateAgent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleEdit = async (id: string, updatedAgent: Partial<Agent>) => {
    try {
      const result = await editAgent(id, updatedAgent);
      if (result) {
        refetch();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error editing agent:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAgent(id);
      if (result) {
        refetch();
      }
    } catch (err) {
      console.error("Error deleting agent:", err);
    }
  };

  const handleCreate = async (agentData: Omit<Agent, "id">) => {
    try {
      const result = await createAgent(agentData);
      if (result) {
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error creating agent:", err);
    }
  };

  const openEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
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
              Delivery Agents
            </h1>
            <p className="text-sm text-gray-600">Manage your delivery agents</p>
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
              title="Add new agent"
              disabled={isCreating}
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

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <AgentTable
            agent={agents}
            isLoading={isLoading || isActionLoading}
            error={error || actionError}
            refetch={refetch}
            onEdit={(id) => {
              const agent = agents.find((a) => a.id === id);
              if (agent) openEditModal(agent);
            }}
            onDelete={handleDelete}
            isSidebarOpen={false}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        isLoading={isCreating}
        error={createError}
      />

      {isEditModalOpen && selectedAgent && (
        <EditAgentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEdit}
          agent={selectedAgent}
          isLoading={isActionLoading}
          error={actionError}
        />
      )}
    </div>
  );
};

export default AgentPage;
