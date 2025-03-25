import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import { useParams } from "next/navigation";

type Subcategory = {
  id: string;
  name: string;
  isActive: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
};

const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Subcategory>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryDetails, setCategoryDetails] = useState<{
    nameCategory: string;
  } | null>(null);

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId as string);
    }
  }, [categoryId]);

  const fetchSubcategories = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/marketplace/category/${id}`);
      if (!response.ok) throw new Error("Failed to fetch subcategories");

      const data = await response.json();
      setSubcategories(data.category.subCategories || []);
      setCategoryDetails({ nameCategory: data.category.nameCategory });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubcategory = () => {
    router.push(
      `/marketplace/products/categories/${categoryId}/subCategories/new`,
    );
  };

  const handleEdit = (subCategoryId: string) => {
    router.push(
      `/marketplace/products/categories/${categoryId}/subCategories/edit/${subCategoryId}`,
    );
  };

  const handleDelete = async (subCategoryId: string) => {
    try {
      const response = await fetch(
        `/api/marketplace/sub_category/${subCategoryId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete subcategory");

      setSubcategories((prev) =>
        prev.filter((item) => item.id !== subCategoryId),
      );
      toast.success("Subcategory deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setOpenMenuId(null);
    }
  };

  // Existing filtering, sorting and pagination logic
  const filteredData = subcategories.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortOrder === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: keyof Subcategory) => {
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

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <div className="flex items-baseline gap-3">
          <h2 className="h2">Subcategories</h2>
          {categoryDetails && (
            <span className="text-lg text-gray-600 dark:text-gray-300">
              ({categoryDetails.nameCategory})
            </span>
          )}
        </div>
        <button
          onClick={handleCreateSubcategory}
          className="btn hover:bg-primary-dark bg-primary text-white"
        >
          Add New
        </button>
      </div>

      <div className="box">
        <div className="bb-dashed mb-6 flex flex-wrap items-center justify-between gap-3 pb-6">
          <p className="font-medium">Subcategory List View</p>
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
                  {sortBy === "name" ? "Name" : "ID"}
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
                          handleSort(field as keyof Subcategory);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {field === "name" ? "Name" : "ID"}
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
                    ID
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
                <td className="p-5">Image</td>
                <td className="p-5">
                  <div
                    className="flex cursor-pointer select-none items-center gap-1"
                    onClick={() => handleSort("name")}
                  >
                    Subcategory Name
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

                <td className="p-5 text-center">Action</td>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center">
                    No subcategories found
                  </td>
                </tr>
              ) : (
                currentItems.map((sub) => (
                  <tr
                    key={sub.id}
                    className="even:bg-primary/5 even:dark:bg-bg3"
                  >
                    <td className="px-3 py-2 pl-6">{sub.id}</td>
                    <td className="px-3 py-2">
                      {sub.image ? (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{sub.name}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`badge ${
                          sub.isActive ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
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
                                openMenuId === sub.id ? null : sub.id,
                              )
                            }
                          >
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          </svg>

                          {openMenuId === sub.id && (
                            <ul className="absolute right-0 top-full z-30 min-w-max rounded-md border border-n30 bg-white p-1.5 shadow-md dark:border-n500 dark:bg-bg4">
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-primary hover:text-white"
                                  onClick={() => handleEdit(sub.id)}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-red-500 hover:text-white"
                                  onClick={() => handleDelete(sub.id)}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-primary duration-300 hover:bg-primary hover:text-n0 md:h-10 md:w-10 ${
                    currentPage === idx + 1
                      ? "bg-primary text-n0"
                      : "border-primary"
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

export default SubcategoryList;
