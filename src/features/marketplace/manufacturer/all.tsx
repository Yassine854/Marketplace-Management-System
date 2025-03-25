import { useEffect, useState } from "react";
import ManufacturerTable from "./components/ManufacturerTable";
import { useRouter } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import styles from "../../suppliers/styles/pagination.module.css";
import { Manufacturer } from "./types/manufacturer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import EditManuForm from "./components/EditManuForm";

const ManufacturerManagementPage = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalManufacturers, setTotalManufacturers] = useState(0);
  const [deleteManufacturerId, setDeleteManufacturerId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] =
    useState<Manufacturer | null>(null);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/marketplace/supplier/getAll?page=${currentPage}&size=${pageSize}&search=${debouncedSearchTerm}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch manufacturers");
        }

        setManufacturers(data.manufacturers || []);
        setTotalManufacturers(data.totalManufacturers || 0);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalManufacturers / pageSize);

  const handleUpdate = async (updatedManufacturer: Manufacturer) => {
    try {
      const response = await fetch(
        `/api/marketplace/supplier/${updatedManufacturer.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedManufacturer),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update manufacturer");
      }

      setManufacturers((prevManufacturers) =>
        prevManufacturers.map((manufacturer) =>
          manufacturer.id === updatedManufacturer.id
            ? updatedManufacturer
            : manufacturer,
        ),
      );

      toast.success("Manufacturer updated successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteManufacturerId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteManufacturerId) return;

    try {
      const response = await fetch(
        `/api/marketplace/supplier/${deleteManufacturerId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete manufacturer");
      }

      setManufacturers((prevManufacturers) =>
        prevManufacturers.filter(
          (manufacturer) => manufacturer.id !== deleteManufacturerId,
        ),
      );

      toast.success("Manufacturer deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsModalOpen(false);
      setDeleteManufacturerId(null);
    }
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
  };

  const handleCloseEdit = () => {
    setEditingManufacturer(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        marginTop: "60px",
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
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 mt-9 flex items-center justify-between pb-6">
              <p className="ml-4 mt-6 text-xl font-bold">
                Manufacturer Management
              </p>
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => router.push("/manufacturer/new")}
                  className="mr-4 flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
                  title="New Manufacturer"
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
                  <span className="hidden md:inline">New Manufacturer</span>
                </button>
              </div>
            </div>

            <div className="mb-5 space-y-4">
              <div className="relative flex w-full gap-2 sm:w-auto sm:min-w-[200px] sm:flex-1">
                <input
                  type="text"
                  placeholder="Search Manufacturers..."
                  className="w-[400px] rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  🔍
                </span>
              </div>
            </div>

            <div
              className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
              style={{ maxHeight: "600px", width: "100%" }}
            >
              <ManufacturerTable
                data={manufacturers}
                loading={loading}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>

            <div className={styles.pagination}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                className="pagination"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

      {editingManufacturer && (
        <EditManuForm
          manufacturer={editingManufacturer}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ManufacturerManagementPage;
