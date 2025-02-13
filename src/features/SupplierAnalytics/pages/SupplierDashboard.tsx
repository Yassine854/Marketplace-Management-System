import React from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBox,
  FaDollarSign,
  FaUsers,
  FaUndo,
} from "react-icons/fa";
import orderData from "../../../../data_test.json";
import ProductRevenueLossChart from "../charts/ProductRevenueLossChart";
import TopArticlesOrdered from "../charts/TopArticlesOrdered";
import SupplierAreaChart from "../charts/SupplierAreaChart";
import SalesByCategory from "../charts/SalesByCategory";
import RegionsOrders from "../charts/RegionsOrders";

const supplierId = "9"; // Example supplier ID (e.g., Technofood)

const currentYear = new Date().getFullYear();
const supplierStats = orderData.orders.reduce(
  (acc, { order }) => {
    const uniqueOrders = new Set(); // Set to ensure unique orderIds
    const uniqueCustomers = new Set(acc.uniqueCustomers); // Preserve unique customers across iterations

    // Process each order and its items
    let orderProcessed = false; // Flag to track if the order has been processed for deliveredOrders

    if (order.items) {
      order.items.forEach((item) => {
        if (
          "supplier" in item &&
          item.supplier?.manufacturer_id === supplierId
        ) {
          // Only process the order once
          if (!orderProcessed) {
            // Check if the order is confirmed and valid (we process it only once)
            if (order.state === "confirmed" && order.status === "valid") {
              acc.deliveredOrders += 1; // Increment deliveredOrders only once
            }
            orderProcessed = true; // Mark the order as processed
          }

          // Add unique orderId to the set (count the order only once, no matter how many items)
          if (!uniqueOrders.has(order.orderId)) {
            uniqueOrders.add(order.orderId);
            acc.totalOrders += 1; // Increment totalOrders only once per unique order
          }

          // Calculate revenue for the supplier
          if (order.state === "confirmed" && order.status === "valid") {
            acc.totalRevenue += parseFloat(item.totalPrice);
          }

          // Track unique customers who paid for this order
          if (order.state === "confirmed" && order.status === "valid") {
            uniqueCustomers.add(order.customerId);
          }

          // Track returned products
          if (order.state === "canceled" && order.status === "invalid") {
            acc.totalReturns += parseInt(item.quantity); // Add the quantity of returned items
          }
        }
      });
    }

    acc.totalCustomers = uniqueCustomers.size; // Update total unique paying customers
    acc.uniqueCustomers = uniqueCustomers; // Persist unique customers across iterations

    return acc;
  },
  {
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    totalReturns: 0, // Track total returned items
    uniqueCustomers: new Set(), // Track unique customers separately
  },
);

const SupplierDashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardDataStats
          title="Total Revenue"
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
          title="Average Order Value"
          total={`${(
            supplierStats.totalRevenue / supplierStats.totalOrders
          ).toFixed(2)} TND`}
        >
          <FaBox className="text-purple-500" />
        </CardDataStats>

        {/* Card for Total Customers who Paid for this supplier */}
        <CardDataStats
          title="Unique Paying Customers"
          total={supplierStats.totalCustomers.toString()}
        >
          <FaUsers className="text-orange-500" />
        </CardDataStats>

        <CardDataStats
          title="Paid Orders"
          total={supplierStats.deliveredOrders.toString()}
        >
          <FaCheckCircle className="text-green-500" />
        </CardDataStats>

        {/* New Card for Total Returns */}
        <CardDataStats
          title="Returned Products"
          total={supplierStats.totalReturns.toString()}
        >
          <FaUndo className="text-red-500" />
        </CardDataStats>

        {/* Supplier Bar Chart */}
        <div className="mt-12">
          <ProductRevenueLossChart supplierId={supplierId} />
        </div>

        {/* Supplier Pie Chart */}
        <div className="mt-6">
          <TopArticlesOrdered supplierId={supplierId} />
        </div>

        {/* Supplier Area Chart */}
        <div className="mt-6">
          <SupplierAreaChart supplierId={supplierId} />
        </div>

        {/* Sales Bar category Chart */}
        <div className="mt-6">
          <SalesByCategory supplierId={supplierId} />
        </div>

        {/*  Chart */}
        <div className="mt-6">
          <RegionsOrders />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
