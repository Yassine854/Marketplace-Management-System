import React, { useState, useEffect } from "react";
import axios from "axios";
import CardDataStats from "../charts/suppliers/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
  FaUndo,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllSuppliersDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, customersRes, warehousesRes] =
          await Promise.all([
            axios.get("http://localhost:3000/api/products"),
            axios.get("http://localhost:3000/api/orders"),
            axios.get("http://localhost:3000/api/customers"),
            axios.get("http://localhost:3000/api/warehouses"),
          ]);

        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setCustomers(customersRes.data);
        setWarehouses(warehousesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate global metrics with warehouse filter
  const totalValidOrders = orders.filter(
    (order) =>
      order.state !== "canceled" &&
      (!startDate || new Date(order.created_at) >= startDate) &&
      (!endDate || new Date(order.created_at) <= endDate) &&
      (!selectedWarehouse || order.store_id === Number(selectedWarehouse)),
  ).length;

  const uniqueCustomers = new Set(
    orders
      .filter(
        (order) =>
          order.state !== "canceled" &&
          (!startDate || new Date(order.created_at) >= startDate) &&
          (!endDate || new Date(order.created_at) <= endDate) &&
          (!selectedWarehouse || order.store_id === Number(selectedWarehouse)),
      )
      .map((order) => order.customer_id),
  ).size;

  const totalReturns = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!startDate || new Date(order.created_at) >= startDate) &&
        (!endDate || new Date(order.created_at) <= endDate) &&
        (!selectedWarehouse || order.store_id === Number(selectedWarehouse)),
    )
    .flatMap((order) => order.items)
    .reduce((sum, item) => sum + item.qty_refunded, 0);

  const totalTurnover = orders
    .filter(
      (order) =>
        order.state !== "canceled" &&
        (!startDate || new Date(order.created_at) >= startDate) &&
        (!endDate || new Date(order.created_at) <= endDate) &&
        (!selectedWarehouse || order.store_id === Number(selectedWarehouse)),
    )
    .flatMap((order) => order.items)
    .reduce((sum, item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return sum + item.qty_invoiced * (product?.price || 0);
    }, 0);

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-6">
      <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
        {/* Warehouse Filter */}
        <div className="flex flex-col md:mr-4">
          <label className="text-lg">Warehouse:</label>
          <select
            value={selectedWarehouse || ""}
            onChange={(e) => setSelectedWarehouse(e.target.value || null)}
            className="rounded border p-2 text-lg"
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div className="flex flex-col md:mr-4">
          <label className="text-lg">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
            isClearable
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            dateFormat="yyyy/MM/dd"
            className="rounded border p-2 text-lg"
            isClearable
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <CardDataStats
          title="Total Revenue"
          total={`${totalTurnover.toFixed(2)} TND`}
        >
          <FaMoneyBillWave className="text-green-500" />
        </CardDataStats>
        <CardDataStats title="Total Orders" total={totalValidOrders.toString()}>
          <FaClipboardList className="text-blue-500" />
        </CardDataStats>
        <CardDataStats
          title="Unique Customers"
          total={uniqueCustomers.toString()}
        >
          <FaUsers className="text-orange-500" />
        </CardDataStats>
        <CardDataStats title="Total Returns" total={totalReturns.toString()}>
          <FaUndo className="text-red-500" />
        </CardDataStats>
      </div>

      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RevenueTrendChart orders={orders} products={products} />
        </div>
        <div>
          <GlobalQuarterlyMetrics orders={orders} products={products} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TopProductsChart orders={orders} products={products} />
        </div>
        <div>
          <InventoryStatusChart products={products} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <CategoryDistributionChart 
            orders={orders} 
            products={products} 
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <GlobalClientSegment 
            orders={orders}
            customers={customers}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      <div className="mt-6">
        <RegionalSalesHeatmap 
          orders={orders} 
          customers={customers}
          products={products}
        />
      </div> */}
    </div>
  );
};

export default AllSuppliersDashboard;
