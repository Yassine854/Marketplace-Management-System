import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ProductType = {
  id: string;
  type: string;
  products: any[];
};

const ProductTypeList = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof ProductType>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<{
    id: string;
    type: string;
  } | null>(null);
  const [newType, setNewType] = useState<string>("");

  // Fetch initial data
  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/marketplace/product_type/getAll");
      if (!response.ok) throw new Error("Failed to fetch product types");
      const data = await response.json();
      setProductTypes(data.productTypes);
      setCurrentPage(1); // Reset to first page after refresh
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  const filteredData = productTypes.filter(
    (item) =>
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Sorting handlers
  const handleSort = (field: keyof ProductType) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Edit functionality
  const handleEdit = async (id: string, newType: string) => {
    try {
      const response = await fetch(`/api/marketplace/product_type/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: newType }),
      });

      if (!response.ok) throw new Error("Failed to update product type");

      setProductTypes((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, type: newType } : item,
        ),
      );
      toast.success("Product type updated successfully");
      setEditingType(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  // Delete functionality
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/marketplace/product_type/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product type");

      setProductTypes((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product type deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    }
  };

  // Create new type
  const handleCreate = async () => {
    try {
      const response = await fetch("/api/marketplace/product_type/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: newType }),
      });

      if (!response.ok) throw new Error("Failed to create product type");

      // Refresh the list after successful creation
      await fetchProductTypes();

      setNewType("");
      toast.success("Product type created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creation failed");
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Product Types</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="New product type"
            className="rounded border p-2"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="btn hover:bg-primary-dark bg-primary text-white"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="box">
        <div className="bb-dashed mb-6 flex flex-wrap items-center justify-between gap-3 pb-6">
          <p className="font-medium">Product Type List View</p>
          <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
            <form className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5">
              <input
                placeholder="Search"
                className="w-full bg-transparent py-2 text-sm focus:outline-none"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button">
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
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                  <path d="M21 21l-6 -6"></path>
                </svg>
              </button>
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
                  <ul className="absolute right-0 top-full z-20 max-h-40 min-w-max flex-col overflow-y-auto rounded-md rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 sm:min-w-[140px]">
                    {["id", "type"].map((field) => (
                      <li
                        key={field}
                        className="cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary"
                        onClick={() => {
                          handleSort(field as keyof ProductType);
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
                    onClick={() => handleSort("type")}
                  >
                    Product Type
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
                      {sortBy === "type" && sortOrder === "asc" ? (
                        <path d="M8 9l4 -4l4 4"></path>
                      ) : (
                        <path d="M16 15l-4 4l-4 -4"></path>
                      )}
                    </svg>
                  </div>
                </td>
                <td className="p-5 text-center">Action</td>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    No product types found
                  </td>
                </tr>
              ) : (
                currentItems.map((productType) => (
                  <tr
                    key={productType.id}
                    className="even:bg-primary/5 even:dark:bg-bg3"
                  >
                    <td className="px-3 py-2 pl-6">{productType.id}</td>
                    <td className="px-3 py-2">
                      {editingType?.id === productType.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingType.type}
                            onChange={(e) =>
                              setEditingType({
                                ...editingType,
                                type: e.target.value,
                              })
                            }
                            className="flex-grow rounded border p-1"
                          />
                          <button
                            onClick={() =>
                              handleEdit(productType.id, editingType.type)
                            }
                            className="hover:bg-primary-dark rounded bg-primary px-3 py-1 text-sm text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingType(null)}
                            className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        productType.type
                      )}
                    </td>
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
                                openMenuId === productType.id
                                  ? null
                                  : productType.id,
                              )
                            }
                          >
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          </svg>

                          {openMenuId === productType.id && (
                            <ul className="absolute right-0 top-full z-30 min-w-max rounded-md border border-n30 bg-white p-1.5 shadow-md dark:border-n500 dark:bg-bg4">
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-primary hover:text-white"
                                  onClick={() => {
                                    setEditingType({
                                      id: productType.id,
                                      type: productType.type,
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
                                    handleDelete(productType.id);
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

        <div className="col-span-12 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
          <p>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <ul className="flex flex-wrap items-center gap-2 md:gap-3 md:font-semibold">
            <li>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180"
              >
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
                >
                  <path d="M15 6l-6 6l6 6"></path>
                </svg>
              </button>
            </li>

            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx}>
                <button
                  onClick={() => paginate(idx + 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 md:h-10 md:w-10 ${
                    currentPage === idx + 1 ? "bg-primary text-n0" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180"
              >
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
                >
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeList;
