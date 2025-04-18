import AgentTable from "../table/AgentTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "@/features/shared/elements/Pagination/pagination";
import { useState, useEffect, useMemo } from "react";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAgent, setSortAgent] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = useMemo(() => {
    let result = agents.filter((agent) => {
      const searchContent =
        `${agent.id} ${agent.firstName} ${agent.lastName} ${agent.email} ${agent.telephone} ${agent.address}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    // Add sorting
    result = result.sort((a, b) => {
      if (sortAgent === "newest") {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      } else {
        return (
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
        );
      }
    });

    return result;
  }, [agents, searchTerm, sortAgent]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  const handleEdit = async (id: string, updatedAgent: Agent) => {
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
      console.error("Error creating customer:", err);
    }
  };

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAgents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-bold capitalize">Delivery Agent</p>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end sm:justify-between">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-2 flex items-center">
                🔍
              </span>
            </div>

            <label htmlFor="sort" className="mr-2 whitespace-nowrap font-bold">
              Sort by:
            </label>
            <select
              id="sort"
              className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortAgent}
              onChange={(e) =>
                setSortAgent(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-56 items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="New Agent"
                disabled={isCreating}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                <span className="hidden md:inline">New Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <AgentTable
          agent={paginatedAgents}
          isLoading={isLoading || isActionLoading}
          error={error || actionError}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={(id: string) => {
            const agent = agents.find((c) => c.id === id);
            if (agent) openEditModal(agent);
          }}
          onDelete={handleDelete}
        />
      </div>
      <Divider />
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
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
            onEdit={async (id, updatedCustomer) => {
              await handleEdit(id, updatedCustomer);
            }}
            agent={selectedAgent}
            isLoading={isActionLoading} // Utiliser le bon état de chargement
            error={actionError} // Utiliser l'erreur des actions
          />
        )}
      </div>
    </div>
  );
};

export default AgentPage;
