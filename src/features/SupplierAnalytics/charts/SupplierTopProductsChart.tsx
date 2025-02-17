import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import orderData from "../../../../data_test.json";

interface ChartState {
  series: { name: string; data: number[] }[];
  options: any;
}

const SupplierTopProductsChart = ({ supplierId }: { supplierId: string }) => {
  const [chartState, setChartState] = useState<ChartState>({
    series: [{ name: "Loading...", data: [0] }],
    options: {
      chart: { type: "bar" },
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: ["Loading..."], title: { text: "Products" } },
      yaxis: { title: { text: "Sales Volume" } },
      colors: ["#3B82F6"],
      dataLabels: { enabled: false },
    },
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [metric, setMetric] = useState<"volume" | "revenue">("volume");

  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);

  useEffect(() => {
    try {
      // 1. Filter orders by date and supplier
      const filteredOrders = orderData.orders.filter(({ order }) => {
        const orderDate = new Date(order.createdAt * 1000);
        const start = startDate || new Date(0);
        const end = endDate || new Date();
        return orderDate >= start && orderDate <= end;
      });

      // 2. Aggregate product data
      const productMap = filteredOrders
        .flatMap(({ order }) => order.items)
        .filter(
          (item) =>
            "supplier" in item && item.supplier?.manufacturer_id === supplierId,
        )
        .reduce((acc, item) => {
          const productId = item.productId;
          const current = acc.get(productId) || {
            name: item.productName,
            volume: 0,
            revenue: 0,
          };

          return acc.set(productId, {
            ...current,
            volume: current.volume + parseFloat(item.quantity),
            revenue: current.revenue + parseFloat(item.totalPrice),
          });
        }, new Map<string, { name: string; volume: number; revenue: number }>());

      // 3. Sort and format data
      const sortedProducts = Array.from(productMap.values())
        .sort((a, b) =>
          metric === "volume" ? b.volume - a.volume : b.revenue - a.revenue,
        )
        .slice(0, 10);

      setChartState({
        series: [
          {
            name: metric === "volume" ? "Units Sold" : "Revenue (TND)",
            data:
              sortedProducts.length > 0
                ? sortedProducts.map((p) =>
                    metric === "volume" ? p.volume : p.revenue,
                  )
                : [0],
          },
        ],
        options: {
          ...chartState.options,
          xaxis: {
            categories:
              sortedProducts.length > 0
                ? sortedProducts.map((p) => p.name)
                : ["No data"],
            title: { text: "Products" },
          },
          yaxis: {
            title: {
              text: metric === "volume" ? "Sales Volume" : "Revenue (TND)",
            },
          },
          colors: [metric === "volume" ? "#3B82F6" : "#10B981"],
        },
      });
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartState({
        series: [{ name: "Error", data: [0] }],
        options: {
          ...chartState.options,
          xaxis: { categories: ["Error loading data"] },
        },
      });
    }
  }, [supplierId, startDate, endDate, metric]);

  return (
    <div className="border-stroke rounded-lg border bg-white p-6 shadow-lg">
      {/* Chart Header */}
      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
        <h3 className="text-xl font-semibold">Top Performing Products</h3>

        {/* Metric Selector */}
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as "volume" | "revenue")}
          className="w-32 rounded border p-1 text-sm"
        >
          <option value="volume">By Volume</option>
          <option value="revenue">By Revenue</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium">Date Range:</label>
        <div className="flex space-x-2">
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Start Date"
              className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="MMM d, yyyy"
              isClearable
            />
            {startDate && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => handleStartDateChange(null)}
              >
                ×
              </button>
            )}
          </div>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="End Date"
              className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="MMM d, yyyy"
              isClearable
            />
            {endDate && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => handleEndDateChange(null)}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartState.series[0].data.length > 0 &&
      chartState.series[0].data[0] !== 0 ? (
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="bar"
          height={400}
        />
      ) : (
        <div className="flex h-96 items-center justify-center text-gray-500">
          No data available for the selected period
        </div>
      )}
    </div>
  );
};

export default SupplierTopProductsChart;
