import React, { useState } from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBox,
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

import "react-datepicker/dist/react-datepicker.css";

const supplierId = "9"; // Example supplier ID (e.g., Technofood)

const SupplierDashboard = () => {
  const [startDate, setStartDate] = useState(new Date()); // Default to current date
  const [endDate, setEndDate] = useState(new Date()); // Default to current date
  const [enableFilter, setEnableFilter] = useState(false); // New state for checkbox

  // Function to handle null date values
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date || new Date()); // Default to current date if null
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date || new Date()); // Default to current date if null
  };

  // Filter orders based on the selected date range
  const filteredOrders = enableFilter
    ? orderData.orders.filter(({ order }) => {
        const orderDate = new Date(order.createdAt * 1000);
        return orderDate >= startDate && orderDate <= endDate;
      })
    : orderData.orders; // Show all orders when filter is disabled

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
          if (!enableFilter) return false;
          const orderDate = new Date(order.createdAt * 1000);
          return orderDate < startDate || orderDate > endDate;
        })
        .flatMap(({ order }) => order.items)
        .filter((item) => item.productId === product.product.productId)
        .reduce((sum, item) => sum + parseFloat(item.quantity), 0);

      // 3. Calculate range-specific quantity
      const rangeQty = enableFilter
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
      {/* Checkbox Control */}
      <div className="mb-4 flex items-center justify-between gap-2 md:justify-start">
        <input
          type="checkbox"
          id="enableFilter"
          checked={enableFilter}
          onChange={(e) => setEnableFilter(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="enableFilter"
          className="text-sm font-medium text-gray-700"
        >
          Enable Date Filtering
        </label>
      </div>

      {/* Modified Date Pickers */}
      <div className="mb-6 flex flex-col justify-between md:flex-row md:space-x-6">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-lg">
            Start Date:
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy/MM/dd"
            className={`rounded border p-2 text-lg ${
              !enableFilter ? "bg-gray-100" : ""
            }`}
            disabled={!enableFilter}
          />
        </div>

        <div className="mt-4 flex flex-col md:mt-0">
          <label htmlFor="endDate" className="text-lg">
            End Date:
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy/MM/dd"
            className={`rounded border p-2 text-lg ${
              !enableFilter ? "bg-gray-100" : ""
            }`}
            disabled={!enableFilter}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      {/* <div className="col-span-3 mt-12 w-full">
    <ProductRevenueLossChart supplierId={supplierId} />
  </div> */}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <TopArticlesOrdered supplierId={supplierId} />
        </div>
        <div>
          <RegionsOrders supplierId={supplierId} />
        </div>
        <div>
          <ClientSegment supplierId={supplierId} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <SupplierCategoryPieChart supplierId={supplierId} />
        </div>
        <div>
          <SupplierTopProductsChart supplierId={supplierId} />
        </div>
        <div>
          <InventoryTrendChart supplierId={supplierId} />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
