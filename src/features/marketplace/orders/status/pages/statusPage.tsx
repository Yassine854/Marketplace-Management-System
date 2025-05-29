import StatusTable from "../table/statusTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "@/features/shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllStatus } from "../hooks/useGetAllStatus";
import { Status } from "@/types/status";
import { useStatusActions } from "../hooks/useStatusActions";
import { useCreateStatus } from "../hooks/useCreateStatus";
import CreateStatusModal from "../components/CreateStatusModal";

const StatusPage = () => {
  const { status, isLoading, error, refetch } = useGetAllStatus();
  const {
    editStatus,
    deleteStatus,
    isLoading: isActionLoading,
    error: actionError,
  } = useStatusActions();
  const {
    createStatus,
    isLoading: isCreating,
    error: createError,
  } = useCreateStatus();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStatus, setSortStatus] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStatus = useMemo(() => {
    return status.filter((status) => {
      const searchContent =
        `${status.id} ${status.name} ${status.stateId}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [status, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  const handleEdit = async (id: string, updatedStatus: Status) => {
    const result = await editStatus(id, updatedStatus);
    if (result) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteStatus(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(status.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStatus = status.slice(startIndex, startIndex + itemsPerPage);

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
          <p className="text-xl font-bold capitalize">Status</p>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end sm:justify-between">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Rechercher..."
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
              value={sortStatus}
              onChange={(e) =>
                setSortStatus(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-56  items-center justify-center  ">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="New Status"
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
                <span className="hidden md:inline">New Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <StatusTable
          status={paginatedStatus.map((status) => ({
            ...status,
            state: { name: "" },
          }))}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={handleEdit}
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
        <CreateStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(name, stateId) =>
            createStatus(name, stateId, () => {
              refetch(); // Rafraîchir la liste des statuts après création
              setIsModalOpen(false);
            })
          }
        />
      </div>
    </div>
  );
};

export default StatusPage;
