import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

type Partner = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: string;
  roleId: string;
  isActive: boolean;
  logo?: string;
  patent?: string;
  responsibleName: string;
  position: string;
  coverageArea: string;
  minimumAmount: number;
  typePartner: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

const PartnerList = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Partner>("username");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/marketplace/partners/getAll");
      if (!response.ok) throw new Error("Failed to fetch partners");
      const data = await response.json();
      setPartners(data.partners);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter
  const filteredData = partners.filter((partner) =>
    Object.values(partner).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortOrder === "asc" ? 1 : -1;
    if (bValue === undefined) return sortOrder === "asc" ? -1 : 1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortOrder === "asc"
        ? aValue === bValue
          ? 0
          : aValue
          ? 1
          : -1
        : aValue === bValue
        ? 0
        : aValue
        ? -1
        : 1;
    }

    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: keyof Partner) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCreate = () => {
    router.push("/marketplace/partners/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/marketplace/partners/edit/${id}`);
  };

  const handleDownloadPatent = (patentUrl: string) => {
    const link = document.createElement("a");
    link.href = patentUrl;

    const fileName = patentUrl.split("/").pop() || "patent.pdf";
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleStatusUpdate = async (id: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/partners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) throw new Error("Update failed");

      setPartners((prev) =>
        prev.map((partner) =>
          partner.id === id ? { ...partner, isActive: newStatus } : partner,
        ),
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/marketplace/partners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Deletion failed");

      setPartners((prev) => prev.filter((partner) => partner.id !== id));
      toast.success("Partner deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    }
  };

  return (
    <div className="mt-12 w-full px-3 py-6 duration-300 sm:px-4 lg:py-8 xxxl:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:mb-8">
        <h2 className="h2">Partners</h2>
        <div className="flex gap-4">
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
          <p className="font-medium">Partner List</p>
          <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
            <form className="hidden w-full max-w-[250px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-3 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-5">
              <input
                placeholder="Search"
                className="w-full bg-transparent py-2 text-sm focus:outline-none"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button">{/* Search icon */}</button>
            </form>

            <div className="flex shrink-0 items-center gap-2">
              <p className="text-xs sm:text-sm">Sort By : </p>
              <div className="relative">
                <div
                  className="flex min-w-max cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n30 bg-primary/5 px-3 py-1.5 text-xs dark:border-n500 dark:bg-bg3 sm:min-w-[140px] sm:px-4 sm:py-2"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  {/* Dropdown icon */}
                </div>
                {isSortDropdownOpen && (
                  <ul className="absolute right-0 top-full z-20 max-h-40 min-w-max flex-col overflow-y-auto rounded-md rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 sm:min-w-[140px]">
                    {["username", "email", "createdAt", "isActive"].map(
                      (field) => (
                        <li
                          key={field}
                          className="cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary"
                          onClick={() => {
                            handleSort(field as keyof Partner);
                            setIsSortDropdownOpen(false);
                          }}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </li>
                      ),
                    )}
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
                {[
                  "Username",
                  "Name",
                  "Email",
                  "Phone",
                  "Type",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <td key={header} className="p-5 pl-6">
                    <div className="flex cursor-pointer select-none items-center gap-1">
                      {header}
                    </div>
                  </td>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    No partners found
                  </td>
                </tr>
              ) : (
                currentItems.map((partner) => (
                  <tr
                    key={partner.id}
                    className="even:bg-primary/5 even:dark:bg-bg3"
                  >
                    <td className="px-3 py-2 pl-6">{partner.username}</td>
                    <td className="px-3 py-2">{`${partner.firstName} ${partner.lastName}`}</td>
                    <td className="px-3 py-2">{partner.email}</td>
                    <td className="px-3 py-2">{partner.telephone}</td>
                    <td className="px-3 py-2">{partner.typePartner.name}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(partner.id, !partner.isActive)
                        }
                        className={`rounded-full px-3 py-1 text-sm ${
                          partner.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {partner.isActive ? "Active" : "Inactive"}
                      </button>
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
                                openMenuId === partner.id ? null : partner.id,
                              )
                            }
                          >
                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          </svg>

                          {openMenuId === partner.id && (
                            <ul className="absolute right-0 top-full z-30 min-w-max rounded-md border border-n30 bg-white p-1.5 shadow-md dark:border-n500 dark:bg-bg4">
                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-primary hover:text-white"
                                  onClick={() => handleEdit(partner.id)}
                                >
                                  Edit
                                </button>
                              </li>

                              {partner.patent && (
                                <li>
                                  <button
                                    className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-blue-500 hover:text-white"
                                    onClick={() => {
                                      handleDownloadPatent(partner.patent!);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Download Patent
                                  </button>
                                </li>
                              )}

                              <li>
                                <button
                                  className="block w-full rounded-md px-3 py-1.5 text-left duration-300 hover:bg-red-500 hover:text-white"
                                  onClick={() => {
                                    handleDelete(partner.id);
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

export default PartnerList;
