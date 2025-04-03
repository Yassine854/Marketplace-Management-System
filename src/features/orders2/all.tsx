import { useEffect, useState } from "react";
import OrderTable from "./components/Order2Table";
import { useRouter } from "next/navigation";
import Pagination from "../shared/elements/pagination/pagination";
import { OrderWithRelations } from "./types/order";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import EditOrderForm from "./components/EditOrderForm";
import { downloadOrderPDF } from "./utils/pdfUtils";
import AdvancedFilter from "./components/AdvancedFilter";
import {
  Agent,
  OrderPayment,
  Partner,
  State,
  Status,
  Customer,
} from "@prisma/client";
const OrderManagementPage = () => {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderWithRelations | null>(
    null,
  );
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filters, setFilters] = useState({
    statusId: "",
    stateId: "",
    customerId: "",
    agentId: "",
    partnerId: "",
    paymentMethodId: "",
    fromMobile: "",
    isActive: "",
    minAmountExclTax: "",
    maxAmountExclTax: "",
    minAmountTTC: "",
    maxAmountTTC: "",
    minAmountBeforePromo: "",
    maxAmountBeforePromo: "",
    minAmountAfterPromo: "",
    maxAmountAfterPromo: "",
    minAmountRefunded: "",
    maxAmountRefunded: "",
    minAmountCanceled: "",
    maxAmountCanceled: "",
    minAmountOrdered: "",
    maxAmountOrdered: "",
    minAmountShipped: "",
    maxAmountShipped: "",
    minLoyaltyPtsValue: "",
    maxLoyaltyPtsValue: "",
    minAmount: "",
    maxAmount: "",
    minWeight: "",
    maxWeight: "",
    dateFrom: "",
    dateTo: "",
    shippingMethod: "",
  });

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OrderPayment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();
  const loadFilterData = async () => {
    try {
      const endpoints = [
        {
          url: "/api/marketplace/status/getAll",
          setter: setStatuses,
          dataKey: "statuses",
        },
        {
          url: "/api/marketplace/state/getAll",
          setter: setStates,
          dataKey: "states",
        },
        {
          url: "/api/marketplace/agents/getAll",
          setter: setAgents,
          dataKey: "agents",
        },
        {
          url: "/api/marketplace/partners/getAll",
          setter: setPartners,
          dataKey: "partners",
        },
        {
          url: "/api/marketplace/payment_method/getAll",
          setter: setPaymentMethods,
          dataKey: "orderPayments",
        }, // Notez le dataKey différent ici
        {
          url: "/api/marketplace/customers/getAll",
          setter: setCustomers,
          dataKey: "customers",
        },
      ];

      const results = await Promise.allSettled(
        endpoints.map(async ({ url }) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch ${url}`);
          return res.json();
        }),
      );

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const { dataKey, setter } = endpoints[index];
          const dataArray = result.value[dataKey] || [];
          setter(dataArray);
        } else {
          console.error(
            `Error loading ${endpoints[index].url}:`,
            result.reason,
          );
        }
      });
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  };

  useEffect(() => {
    loadFilterData();
  }, []);
  useEffect(() => {
    console.log("Statuses:", statuses);
    console.log("States:", states);
    console.log("Agents:", agents);
    console.log("Partners:", partners);
    console.log("Payment Methods:", paymentMethods);
    console.log("Customers:", customers);
  }, [statuses, states, agents, partners, paymentMethods, customers]);
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = new URL(
        "/api/marketplace/orders/getAll",
        window.location.origin,
      );
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("limit", itemsPerPage.toString());

      if (debouncedSearchTerm) {
        url.searchParams.append("searchById", debouncedSearchTerm);
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
      setTotalOrders(data.totalOrders || 0);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, debouncedSearchTerm, itemsPerPage, filters]);

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

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const handleUpdate = async (updatedOrder: OrderWithRelations) => {
    try {
      const response = await fetch(
        `/api/marketplace/orders/${updatedOrder.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );

      toast.success("Order updated successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteOrderId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    try {
      const response = await fetch(`/api/marketplace/orders/${deleteOrderId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete order");
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== deleteOrderId),
      );

      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsModalOpen(false);
      setDeleteOrderId(null);
    }
  };

  const handleEdit = (order: OrderWithRelations) => {
    setEditingOrder(order);
  };
  const handleDownload = async (orderId: string): Promise<void> => {
    const orderToDownload = orders.find((order) => order.id === orderId);

    if (orderToDownload) {
      try {
        downloadOrderPDF(orderToDownload);
      } catch (error) {
        toast.error(`Error downloading order: ${(error as Error).message}`);
      }
    }
  };
  const handleCloseEdit = () => {
    setEditingOrder(null);
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
          marginLeft: "20px",
        }}
      >
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-14">
            <div className="bb-dashed mb-6 mt-9 flex items-center justify-between pb-6">
              <p className="ml-4 mt-6 text-xl font-bold">Order Management</p>
              <div className="flex h-12 items-center justify-center">
                <button
                  onClick={() => router.push("/orders2/new")}
                  className="btn flex items-center gap-2 px-3 py-2.5 text-sm"
                  title="New Order"
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
                  <span className="md:inline">New Order</span>
                </button>
              </div>
            </div>

            <div className="mb-5 space-y-4">
              <div className="relative flex w-full gap-2 sm:w-auto sm:min-w-[200px] sm:flex-1">
                <input
                  type="text"
                  placeholder="Search by Order ID..."
                  className="w-[400px] rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  🔍
                </span>
                <button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Advanced Filter
                </button>
              </div>
            </div>
            {showAdvancedFilter && (
              <AdvancedFilter
                statuses={statuses}
                states={states}
                agents={agents}
                partners={partners}
                customers={customers}
                paymentMethods={paymentMethods}
                filters={filters}
                onFilterChange={(newFilters) => setFilters(newFilters)}
                onReset={() => {
                  setFilters({
                    statusId: "",
                    stateId: "",
                    customerId: "",
                    agentId: "",
                    partnerId: "",
                    paymentMethodId: "",
                    fromMobile: "",
                    isActive: "",
                    minAmount: "",
                    maxAmount: "",
                    minAmountExclTax: "",
                    maxAmountExclTax: "",
                    minAmountTTC: "",
                    maxAmountTTC: "",
                    minAmountBeforePromo: "",
                    maxAmountBeforePromo: "",
                    minAmountAfterPromo: "",
                    maxAmountAfterPromo: "",
                    minAmountRefunded: "",
                    maxAmountRefunded: "",
                    minAmountCanceled: "",
                    maxAmountCanceled: "",
                    minAmountOrdered: "",
                    maxAmountOrdered: "",
                    minAmountShipped: "",
                    maxAmountShipped: "",
                    minLoyaltyPtsValue: "",
                    maxLoyaltyPtsValue: "",
                    minWeight: "",
                    maxWeight: "",
                    dateFrom: "",
                    dateTo: "",
                    shippingMethod: "",
                  });
                  setShowAdvancedFilter(false);
                }}
                onApply={() => {
                  setShowAdvancedFilter(false);
                  setCurrentPage(1);
                  fetchOrders();
                }}
              />
            )}

            <div
              className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
              style={{ maxHeight: "600px", width: "100%" }}
            >
              <OrderTable
                data={orders}
                loading={loading}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onDownload={handleDownload}
              />
            </div>

            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

      {editingOrder && (
        <EditOrderForm
          order={editingOrder}
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

export default OrderManagementPage;
