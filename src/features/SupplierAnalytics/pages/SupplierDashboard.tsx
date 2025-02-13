import React, { useState } from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBox,
  FaUsers,
  FaUndo,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import orderData from "../../../../data_test.json";
import ProductRevenueLossChart from "../charts/ProductRevenueLossChart";
import TopArticlesOrdered from "../charts/TopArticlesOrdered";
import SupplierAreaChart from "../charts/SupplierAreaChart";
import SalesByCategory from "../charts/SalesByCategory";
import RegionsOrders from "../charts/RegionsOrders";

const supplierId = "9"; // Example supplier ID (e.g., Technofood)

const SupplierDashboard = () => {
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [dayFilter, setDayFilter] = useState(new Date().getDate());
  const [isMonthChecked, setIsMonthChecked] = useState(false);
  const [isDayChecked, setIsDayChecked] = useState(false);

  // Functions to increment and decrement year, month, and day
  const incrementYear = () => setYearFilter(yearFilter + 1);
  const decrementYear = () => setYearFilter(yearFilter - 1);

  const incrementMonth = () => {
    if (monthFilter < 12) {
      setMonthFilter(monthFilter + 1);
    } else {
      setMonthFilter(1);
    }
  };

  const decrementMonth = () => {
    if (monthFilter > 1) {
      setMonthFilter(monthFilter - 1);
    } else {
      setMonthFilter(12);
    }
  };

  const incrementDay = () => {
    const maxDay = new Date(yearFilter, monthFilter, 0).getDate();
    if (dayFilter < maxDay) {
      setDayFilter(dayFilter + 1);
    } else {
      setDayFilter(1);
    }
  };

  const decrementDay = () => {
    if (dayFilter > 1) {
      setDayFilter(dayFilter - 1);
    } else {
      setDayFilter(new Date(yearFilter, monthFilter - 1, 0).getDate());
    }
  };

  const filteredOrders = orderData.orders.filter(({ order }) => {
    const orderDate = new Date(order.createdAt * 1000);
    const orderYear = orderDate.getFullYear();
    const orderMonth = orderDate.getMonth() + 1;
    const orderDay = orderDate.getDate();

    // Apply filters based on the month and day checkboxes
    return (
      orderYear === yearFilter &&
      (isMonthChecked ? orderMonth === monthFilter : true) &&
      (isDayChecked && isMonthChecked ? orderDay === dayFilter : true)
    );
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
      {/* Date Search Input */}
      <div className="mb-6 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-6 md:space-y-0">
        {/* Year Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="yearFilter" className="text-lg">
            Year:
          </label>
          <button
            onClick={decrementYear}
            className="rounded border p-2 text-lg"
          >
            <FaArrowDown />
          </button>
          <input
            id="yearFilter"
            type="number"
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
            className="w-24 rounded border p-2 text-lg"
            min="2000"
            max="2099"
          />
          <button
            onClick={incrementYear}
            className="rounded border p-2 text-lg"
          >
            <FaArrowUp />
          </button>
        </div>

        {/* Month Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="monthFilter" className="text-lg">
            Month:
          </label>
          <input
            type="checkbox"
            checked={isMonthChecked}
            onChange={(e) => setIsMonthChecked(e.target.checked)}
            className="mr-2"
          />
          <button
            onClick={decrementMonth}
            className="rounded border p-2 text-lg"
          >
            <FaArrowDown />
          </button>
          <input
            id="monthFilter"
            type="number"
            value={monthFilter}
            onChange={(e) => setMonthFilter(parseInt(e.target.value))}
            className="w-24 rounded border p-2 text-lg"
            min="1"
            max="12"
            disabled={!isMonthChecked}
          />
          <button
            onClick={incrementMonth}
            className="rounded border p-2 text-lg"
          >
            <FaArrowUp />
          </button>
        </div>

        {/* Day Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="dayFilter" className="text-lg">
            Day:
          </label>
          <input
            type="checkbox"
            checked={isDayChecked}
            onChange={(e) => setIsDayChecked(e.target.checked)}
            disabled={!isMonthChecked}
            className="mr-2"
          />
          <button onClick={decrementDay} className="rounded border p-2 text-lg">
            <FaArrowDown />
          </button>
          <input
            id="dayFilter"
            type="number"
            value={dayFilter}
            onChange={(e) => setDayFilter(parseInt(e.target.value))}
            className="w-24 rounded border p-2 text-lg"
            min="1"
            max={new Date(yearFilter, monthFilter, 0).getDate()}
            disabled={!isDayChecked || !isMonthChecked}
          />
          <button onClick={incrementDay} className="rounded border p-2 text-lg">
            <FaArrowUp />
          </button>
        </div>
      </div>

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
          title="Unique Paying Customers"
          total={supplierStats.totalCustomers.toString()}
        >
          <FaUsers className="text-orange-500" />
        </CardDataStats>

        <CardDataStats
          title="Average Order Value"
          total={`${(isNaN(
            supplierStats.totalRevenue / (supplierStats.deliveredOrders ?? 0),
          )
            ? 0
            : supplierStats.totalRevenue / (supplierStats.deliveredOrders ?? 0)
          ).toFixed(2)} TND`}
        >
          <FaBox className="text-purple-500" />
        </CardDataStats>

        <CardDataStats
          title="Paid Orders"
          total={supplierStats.deliveredOrders.toString()}
        >
          <FaCheckCircle className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Returned Products"
          total={supplierStats.totalReturns.toString()}
        >
          <FaUndo className="text-red-500" />
        </CardDataStats>

        <div className="col-span-3 mt-12 w-full">
          <SupplierAreaChart supplierId={supplierId} />
        </div>

        <div className="mt-12">
          <ProductRevenueLossChart supplierId={supplierId} />
        </div>

        <div className="mt-6">
          <TopArticlesOrdered supplierId={supplierId} />
        </div>

        <div className="mt-6">
          <SalesByCategory supplierId={supplierId} />
        </div>

        <div className="mt-6">
          <RegionsOrders />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
