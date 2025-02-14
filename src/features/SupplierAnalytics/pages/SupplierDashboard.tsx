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

import "react-datepicker/dist/react-datepicker.css";

const supplierId = "9"; // Example supplier ID (e.g., Technofood)

const SupplierDashboard = () => {
  const [startDate, setStartDate] = useState(new Date()); // Default to current date
  const [endDate, setEndDate] = useState(new Date()); // Default to current date

  // Function to handle null date values
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date || new Date()); // Default to current date if null
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date || new Date()); // Default to current date if null
  };

  // Filter orders based on the selected date range
  const filteredOrders = orderData.orders.filter(({ order }) => {
    const orderDate = new Date(order.createdAt * 1000);

    // Check if the order date is within the selected date range
    return orderDate >= startDate && orderDate <= endDate;
  });

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
              acc.totalRevenue += parseFloat(item.totalPrice);
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
      totalRevenue: 0,
      deliveredOrders: 0,
      totalCustomers: 0,
      totalReturns: 0,
      uniqueCustomers: new Set(),
    },
  );

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-6">
      {/* Date Range Filter */}
      <div className="mb-6 flex justify-center space-x-6">
        <div>
          <label htmlFor="startDate" className="text-lg">
            Start Date:
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="text-lg">
            End Date:
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardDataStats
          title="Turnover"
          total={`${supplierStats.totalRevenue.toFixed(2)} TND`}
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

        {/* <CardDataStats
          title="Average Order Value"
          total={`${(
            isNaN(supplierStats.totalRevenue / (supplierStats.deliveredOrders ?? 0))
              ? 0
              : supplierStats.totalRevenue / (supplierStats.deliveredOrders ?? 0)
          ).toFixed(2)} TND`}
        >
          <FaBox className="text-purple-500" />
        </CardDataStats> */}

        {/* <CardDataStats
          title="Paid Orders"
          total={supplierStats.deliveredOrders.toString()}
        >
          <FaCheckCircle className="text-green-500" />
        </CardDataStats> */}

        <CardDataStats
          title="Returned Products"
          total={supplierStats.totalReturns.toString()}
        >
          <FaUndo className="text-red-500" />
        </CardDataStats>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Revenue Chart taking 2 columns on medium screens and above */}
        <div className="md:col-span-2">
          <SupplierAreaChart supplierId={supplierId} />
        </div>

        {/* Available Products taking 1 column */}
        <div>
          <AvailableProducts supplierId={supplierId} />
        </div>
      </div>

      <div className="col-span-3 mt-12 w-full">
        <ProductRevenueLossChart supplierId={supplierId} />
      </div>

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
    </div>
  );
};

export default SupplierDashboard;
