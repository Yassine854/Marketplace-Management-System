import { useEffect, useState } from "react";
import PurchaseTable from "./PurchaseTable";
import usePurchaseStore from "../stores/purchaseStore";
import AdvancedFilters from "../components/AdvancedFilters/AdvancedFiltersPers";
import Pagination from "../components/Pagination";

const InProgressPage = () => {
  const { purchases, loading, error, fetchPurchases, total } =
    usePurchaseStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPurchases(currentPage, pageSize, {
          search: searchTerm,
          ...activeFilters,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize, searchTerm, activeFilters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPurchases(currentPage, pageSize, {
        search: debouncedSearchTerm,
        ...activeFilters,
      });
    };

    fetchData();
  }, [debouncedSearchTerm]);

  const handleSearch = () => {
    const normalizedSearch = searchTerm.toLowerCase();
    fetchPurchases(1, pageSize, {
      search: normalizedSearch,
      ...activeFilters,
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 mt-9 flex items-center pb-6">
              <p className="ml-4 mt-6 text-xl font-bold">Supplier Orders</p>
            </div>

            <div className="mb-5 space-y-4">
              <div className="flex gap-2">
                <input
                  placeholder="Search (Order ID, Supplier, Warehouse)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 rounded border p-2"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                >
                  🔍
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded bg-gray-200 px-4 py-2"
                >
                  {showFilters ? "Hide Filters" : "Filters"}
                </button>
              </div>

              {showFilters && (
                <AdvancedFilters
                  onApply={(filters) => {
                    setActiveFilters(filters);
                    setCurrentPage(1);
                  }}
                />
              )}

              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(
                  ([key, value]) =>
                    value && (
                      <span
                        key={key}
                        className="rounded-full bg-gray-100 px-2 py-1 text-sm"
                      >
                        {key}: {value}
                      </span>
                    ),
                )}
              </div>
            </div>

            <div
              className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
              style={{ maxHeight: "400px" }}
            >
              <PurchaseTable data={purchases} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InProgressPage;
