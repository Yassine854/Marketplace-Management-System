import CustomerTable from "../table/CustomerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState, useEffect, useMemo } from "react";
import Pagination from "@/features/shared/elements/Pagination/Pagination";

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
        return true;
      }
      return false;
    } catch (err) {
      // Do not close the modal on error
      // Error will be shown via the error prop
      return false;
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
        return true;
      }
      return false;
    } catch (err) {
      // Do not close the modal on error
      // Error will be shown via the error prop
      return false;
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
              Customers
            </h1>
            <p className="text-sm text-gray-600">
              Manage your customer information
            </p>
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
              title="Add new customer"
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
              <span className="hidden sm:inline">Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="rounded-lg bg-white p-4">
          <CustomerTable
            customer={customers}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEdit={(id: string, customer: Customer) => {
              const foundCustomer = customers.find((c) => c.id === id);
              if (foundCustomer) openEditModal(foundCustomer);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
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
  );
};

export default CustomerPage;
