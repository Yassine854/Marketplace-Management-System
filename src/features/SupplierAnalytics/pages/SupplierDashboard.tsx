import React, { useState } from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
  FaUndo,
} from "react-icons/fa";
import orderData from "../../../../data_test.json";
import ProductRevenueLossChart from "../charts/ProductRevenueLossChart";
import TopArticlesOrdered from "../charts/TopArticlesOrdered";
import SupplierAreaChart from "../charts/SupplierAreaChart";
import RegionsOrders from "../charts/RegionsOrders";
import AvailableProducts from "../charts/AvailableProducts";
import DatePicker from "react-datepicker";
import ClientSegment from "../charts/ClientSegment";
import SupplierQuarterlyMetrics from "../charts/SupplierQuarterlyMetrics";
import SupplierCategoryPieChart from "../charts/SupplierCategoryPieChart";
import SupplierTopProductsChart from "../charts/SupplierTopProductsChart";
import InventoryTrendChart from "../charts/InventoryTrendChart";
import EmailFormPopup from "./email";
import "react-datepicker/dist/react-datepicker.css";

const supplierId = "9"; // Example supplier ID (e.g., Technofood)

const SupplierDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null); // Default to null
  const [endDate, setEndDate] = useState<Date | null>(null); // Default to null
  const [showEmailForm, setShowEmailForm] = useState(false);
  const supplierDetails = orderData.products.find(
    (p) => p.product.supplier?.manufacturer_id === supplierId,
  )?.product.supplier;

  // Function to handle date changes
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // Filter orders based on the selected date range
  const filteredOrders = orderData.orders.filter(({ order }) => {
    const orderDate = new Date(order.createdAt * 1000);
    return (
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= endDate)
    );
  });

  const calculateTurnover = () => {
    const supplierProducts = orderData.products.filter(
      (p) => p.product.supplier?.manufacturer_id === supplierId,
    );

    return supplierProducts.reduce((total, product) => {
      const costPrice = parseFloat(product.product.costPrice);
      const currentQty = parseFloat(product.product.qty);

      // 1. Get ALL historical ordered quantities
      const allOrderedQty = orderData.orders
        .filter(
          ({ order }) =>
            order.state === "confirmed" && order.status === "valid",
        )
        .flatMap(({ order }) => order.items)
        .filter((item) => item.productId === product.product.productId)
        .reduce((sum, item) => sum + parseFloat(item.quantity), 0);

      // 2. Get quantities OUTSIDE date range
      const excludedOrderedQty = orderData.orders
        .filter(({ order }) => {
          const orderDate = new Date(order.createdAt * 1000);
          return (
            (startDate && orderDate < startDate) ||
            (endDate && orderDate > endDate)
          );
        })
        .flatMap(({ order }) => order.items)
        .filter((item) => item.productId === product.product.productId)
        .reduce((sum, item) => sum + parseFloat(item.quantity), 0);

      // 3. Calculate range-specific quantity
      const rangeQty =
        startDate || endDate
          ? currentQty + allOrderedQty - excludedOrderedQty
          : currentQty + allOrderedQty;

      return total + costPrice * rangeQty;
    }, 0);
  };

  const supplierStats = filteredOrders.reduce(
    (acc, { order }) => {
      const uniqueOrders = new Set();
      const uniqueCustomers = new Set(acc.uniqueCustomers);
      let orderProcessed = false;

      if (order.items) {
        order.items.forEach((item) => {
          if (
            "supplier" in item &&
            item.supplier?.manufacturer_id === supplierId
          ) {
            if (!orderProcessed) {
              if (order.state === "confirmed" && order.status === "valid") {
                acc.deliveredOrders += 1;
              }
              orderProcessed = true;
            }

            if (!uniqueOrders.has(order.orderId)) {
              uniqueOrders.add(order.orderId);
              acc.totalOrders += 1;
            }

            if (order.state === "confirmed" && order.status === "valid") {
              uniqueCustomers.add(order.customerId);
            }

            if (order.state === "canceled" && order.status === "invalid") {
              acc.totalReturns += parseInt(item.quantity);
            }
          }
        });
      }

      acc.totalCustomers = uniqueCustomers.size;
      acc.uniqueCustomers = uniqueCustomers;

      return acc;
    },
    {
      totalOrders: 0,
      totalTurnover: calculateTurnover(),
      deliveredOrders: 0,
      totalCustomers: 0,
      totalReturns: 0,
      uniqueCustomers: new Set(),
    },
  );

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-6">
      {/* Modified Date Pickers */}
      <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
        <div className="flex flex-col md:mr-4">
          <label htmlFor="startDate" className="text-lg">
            Start Date:
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
            isClearable
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-lg">
            End Date:
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
            isClearable
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <CardDataStats
          title="Turnover"
          total={`${supplierStats.totalTurnover.toFixed(2)} TND`}
        >
          <FaMoneyBillWave className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Total Orders"
          total={supplierStats.totalOrders.toString()}
        >
          <FaClipboardList className="text-blue-500" />
        </CardDataStats>

        <CardDataStats
          title="Unique Paying Customers"
          total={supplierStats.totalCustomers.toString()}
        >
          <FaUsers className="text-orange-500" />
        </CardDataStats>

        <CardDataStats
          title="Returned Products"
          total={supplierStats.totalReturns.toString()}
        >
          <FaUndo className="text-red-500" />
        </CardDataStats>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <SupplierAreaChart supplierId={supplierId} />
        </div>
        <div className="mt-6">
          <SupplierQuarterlyMetrics supplierId={supplierId} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProductRevenueLossChart supplierId={supplierId} />
        </div>
        <div>
          <AvailableProducts supplierId={supplierId} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <TopArticlesOrdered supplierId={supplierId} />
        </div>
        <div>
          <SupplierCategoryPieChart supplierId={supplierId} />
        </div>
        <div>
          <ClientSegment supplierId={supplierId} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <RegionsOrders supplierId={supplierId} />
        </div>
        <div>
          <SupplierTopProductsChart supplierId={supplierId} />
        </div>
        <div>
          <InventoryTrendChart supplierId={supplierId} />
        </div>
      </div>

      <button
        onClick={() => setShowEmailForm(true)}
        className="fixed bottom-10 right-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      </button>

      {/* Email Form Popup */}
      {showEmailForm && supplierDetails && (
        <EmailFormPopup
          onClose={() => setShowEmailForm(false)}
          supplierDetails={{
            company_name: supplierDetails.company_name,
            contact_name: supplierDetails.contact_name,
            phone_number: supplierDetails.phone_number,
            email: supplierDetails.email,
            address: `${supplierDetails.postal_code} ${supplierDetails.city}, ${supplierDetails.country}`,
          }}
        />
      )}
    </div>
  );
};

export default SupplierDashboard;
