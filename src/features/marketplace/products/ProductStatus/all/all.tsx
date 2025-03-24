import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ProductStatus = {
  id: string;
  name: string;
  actif: boolean;
  products: any[];
};

const ProductStatusList = () => {
  const [productStatuses, setProductStatuses] = useState<ProductStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof ProductStatus>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newName, setNewName] = useState<string>("");

  useEffect(() => {
    fetchProductStatuses();
  }, []);

  const fetchProductStatuses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/marketplace/product_status/getAll");
      if (!response.ok) throw new Error("Failed to fetch product statuses");
      const data = await response.json();
      setProductStatuses(data.productStatuses);
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = productStatuses.filter((item) => {
    const name = item.name?.toLowerCase() ?? "";
    const id = item.id?.toLowerCase() ?? "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: keyof ProductStatus) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleEdit = async (id: string, newName: string) => {
    try {
      const response = await fetch(`/api/marketplace/product_status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error("Failed to update product status");

      setProductStatuses((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name: newName } : item,
        ),
      );
      toast.success("Product status updated successfully");
      setEditingStatus(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/marketplace/product_status/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product status");
      setProductStatuses((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product status deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/marketplace/product_status/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error("Failed to create product status");
      await fetchProductStatuses();
      setNewName("");
      toast.success("Product status created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creation failed");
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Product Statuses</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="New status"
              className="rounded border p-2"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              type="submit"
              className="btn hover:bg-primary-dark bg-primary text-white"
            >
              Add New
            </button>
          </div>
        </form>
      </div>

      <div className="box">
        <div className="bb-dashed mb-6 flex flex-wrap items-center justify-between gap-3 pb-6">
          <p className="font-medium">Status List View</p>
          <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
            <form className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5">
              <input
                placeholder="Search"
                className="w-full bg-transparent py-2 text-sm focus:outline-none"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="flex shrink-0 items-center gap-2">
              <p className="text-xs sm:text-sm">Sort By : </p>
              <div className="relative">
                <div
                  className="flex min-w-max cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n30 bg-primary/5 px-3 py-1.5 text-xs dark:border-n500 dark:bg-bg3 sm:min-w-[140px] sm:px-4 sm:py-2"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6l6 -6"></path>
                  </svg>
                </div>
                {isSortDropdownOpen && (
                  <ul className="absolute right-0 top-full z-20 min-w-max flex-col rounded-md rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 sm:min-w-[140px]">
                    {["id", "name"].map((field) => (
                      <li
                        key={field}
                        className="cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary"
                        onClick={() => {
                          handleSort(field as keyof ProductStatus);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bb-dashed mb-6 overflow-x-auto pb-6">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-primary/5 font-semibold dark:bg-bg3">
                <td className="p-5 pl-6">
                  <div
                    className="flex cursor-pointer select-none items-center gap-1"
                    onClick={() => handleSort("id")}
                  >
                    Serial No
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {sortBy === "id" && sortOrder === "asc" ? (
                        <path d="M8 9l4 -4l4 4"></path>
                      ) : (
                        <path d="M16 15l-4 4l-4 -4"></path>
                      )}
                    </svg>
                  </div>
                </td>
                <td className="p-5">
                  <div
                    className="flex cursor-pointer select-none items-center gap-1"
                    onClick={() => handleSort("name")}
                  >
                    Status Name
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {sortBy === "name" && sortOrder === "asc" ? (
                        <path d="M8 9l4 -4l4 4"></path>
                      ) : (
                        <path d="M16 15l-4 4l-4 -4"></path>
                      )}
                    </svg>
                  </div>
                </td>
                <td className="p-5">Active</td>
                <td className="p-5">Products</td>
                <td className="p-5 text-center">Action</td>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    No statuses found
                  </td>
                </tr>
              ) : (
                currentItems.map((status) => (
                  <tr
                    key={status.id}
                    className="even:bg-primary/5 even:dark:bg-bg3"
                  >
                    <td className="px-3 py-2 pl-6">{status.id}</td>
                    <td className="px-3 py-2">
                      {editingStatus?.id === status.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingStatus.name}
                            onChange={(e) =>
                              setEditingStatus({
                                ...editingStatus,
                                name: e.target.value,
                              })
                            }
                            className="flex-grow rounded border p-1"
                          />
                          <button
                            onClick={() =>
                              handleEdit(status.id, editingStatus.name)
                            }
                            className="hover:bg-primary-dark rounded bg-primary px-3 py-1 text-sm text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStatus(null)}
                            className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        status.name
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`badge ${
                          status.actif ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {status.actif ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{status.products.length}</td>
                    <td className="py-2">
                      <div className="flex justify-center">
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === status.id ? null : status.id,
                              )
                            }
                          >
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          </svg>

                          {openMenuId === status.id && (
                            <ul className="absolute right-0 top-full z-30 min-w-max rounded-md border border-n30 bg-white p-1.5 shadow-md dark:border-n500 dark:bg-bg4">
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-primary hover:text-white"
                                  onClick={() => {
                                    setEditingStatus({
                                      id: status.id,
                                      name: status.name,
                                    });
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-red-500 hover:text-white"
                                  onClick={() => {
                                    handleDelete(status.id);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination remains the same */}
      </div>
    </div>
  );
};

export default ProductStatusList;
