import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supplierData from "../../../../data_test.json";

const newColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F1C40F",
  "#8E44AD",
  "#E74C3C",
  "#3498DB",
  "#2ECC71",
  "#9B59B6",
  "#F39C12",
];

const TopArticlesOrdered: React.FC<{ supplierId: string }> = ({
  supplierId,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [state, setState] = useState<{
    series: number[];
    labels: string[];
    ordersCount: number[];
  }>({ series: [], labels: [], ordersCount: [] });

  useEffect(() => {
    const productOrders: Record<
      string,
      { quantity: number; orderCount: number }
    > = {};

    supplierData.orders.forEach((order) => {
      const orderDate = new Date(order.order.createdAt * 1000);

      if (
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      ) {
        order.order.items.forEach((item) => {
          if (item.supplier.manufacturer_id === supplierId) {
            const productName = item.productName;
            const quantity = parseFloat(item.quantity);

            if (!productOrders[productName]) {
              productOrders[productName] = { quantity: 0, orderCount: 0 };
            }

            productOrders[productName].quantity += quantity;
            productOrders[productName].orderCount++;
          }
        });
      }
    });

    const totalQuantity = Object.values(productOrders).reduce(
      (acc, curr) => acc + curr.quantity,
      0,
    );
    const labels = Object.keys(productOrders);

    setState({
      series: labels.map((name) =>
        Number(
          ((productOrders[name].quantity / totalQuantity) * 100).toFixed(2),
        ),
      ),
      labels,
      ordersCount: labels.map((name) => productOrders[name].orderCount),
    });
  }, [supplierId, startDate, endDate]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 400,
      fontFamily: "Satoshi, sans-serif",
      background: "#FFFFFF",
    },
    labels: state.labels,
    colors: newColors.slice(0, state.labels.length),
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    tooltip: {
      y: {
        formatter: (_, { seriesIndex }) =>
          `${state.ordersCount[seriesIndex]} Orders`,
      },
    },
  };

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">Date Range:</label>

        <div className="flex gap-3">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Start Date"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="End Date"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
        <h3 className="mb-6 text-center text-2xl font-semibold">
          Most Ordered Products
        </h3>
        <ReactApexChart
          options={options}
          series={state.series}
          type="donut"
          height={350}
        />
      </div>

      {/* Product List Section with full names */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {state.labels.map((product, index) => (
          <div
            key={product}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="mt-1 h-5 w-5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: newColors[index % newColors.length] }}
            />
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="break-words font-medium text-gray-800">
                  {product}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {state.ordersCount[index]} orders
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArticlesOrdered;
