import CustomerTable from "../table/CustomerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState, useEffect, useMemo } from "react";
import Pagination from "@/features/shared/elements/Pagination/pagination";

import { useGetAllCustomers } from "../hooks/useGetAllCustomers";
import { Customer } from "@/types/customer";
import { useCustomersActions } from "../hooks/useCustomersActions";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import CreateCustomerModal from "../components/CreateCustomerModel";
import EditCustomerModal from "../components/EditCustomerModel";

const CustomerPage = () => {
  const {
    customer: customers,
    isLoading,
    error,
    refetch,
  } = useGetAllCustomers();
  const {
    editCustomer,
    deleteCustomer,
    isLoading: isActionLoading,
    error: actionError,
  } = useCustomersActions();
  const {
    createCustomer,
    isLoading: isCreating,
    error: createError,
  } = useCreateCustomer();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((customer) => {
      const searchContent =
        `${customer.id} ${customer.firstName} ${customer.lastName} ${customer.email} ${customer.telephone} ${customer.address}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    // Add sorting
    result = result.sort((a, b) => {
      if (sortState === "newest") {
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
  }, [customers, searchTerm, sortState]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  const handleEdit = async (id: string, formData: FormData) => {
    try {
      const result = await editCustomer(id, formData);
      if (result) {
        await refetch();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error editing customer:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCustomer(id);
      if (result) {
        refetch();
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const handleCreate = async (customerData: Omit<Customer, "id">) => {
    try {
      const result = await createCustomer(customerData);
      if (result) {
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
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
          <p className="text-xl font-bold capitalize">Customers</p>

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
              value={sortState}
              onChange={(e) =>
                setSortState(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-56 items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="New Customer"
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
                <span className="hidden md:inline">New Customer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <CustomerTable
          customer={paginatedCustomers}
          isLoading={isLoading || isActionLoading}
          error={error || actionError}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={(id: string) => {
            const customer = customers.find((c) => c.id === id);
            if (customer) openEditModal(customer);
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
        <CreateCustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
          isLoading={isCreating}
          error={createError}
        />
        {isEditModalOpen && selectedCustomer && (
          <EditCustomerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={handleEdit}
            customer={selectedCustomer}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
