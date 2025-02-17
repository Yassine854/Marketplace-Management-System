import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import orderData from "../../../../data_test.json";

interface ChartState {
  series: { name: string; data: { x: Date; y: number }[] }[];
  options: any;
}

const InventoryTrendChart = ({ supplierId }: { supplierId: string }) => {
  const [chartState, setChartState] = useState<ChartState>({
    series: [],
    options: {
      chart: { type: "line" },
      xaxis: { type: "datetime" },
      yaxis: { title: { text: "Stock Level" } },
      stroke: { curve: "smooth" },
      colors: ["#3B82F6", "#10B981"],
      tooltip: {
        x: { format: "dd MMM yyyy" },
      },
    },
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);

  useEffect(() => {
    // 1. Get supplier's products
    const supplierProducts = orderData.products.filter(
      (p) => p.product.supplier?.manufacturer_id === supplierId,
    );

    // 2. Filter orders and group by time
    const filteredOrders = orderData.orders.filter(({ order }) => {
      const orderDate = new Date(order.createdAt * 1000);
      const start = startDate || new Date(0);
      const end = endDate || new Date();
      return orderDate >= start && orderDate <= end;
    });

    // 3. Create timeline
    const dateMap = new Map<string, { stock: number; sales: number }>();

    filteredOrders.forEach(({ order }) => {
      const orderDate = new Date(order.createdAt * 1000);
      const timeKey =
        frequency === "daily"
          ? orderDate.toISOString().split("T")[0]
          : `${orderDate.getFullYear()}-W${Math.ceil(
              ((orderDate.getTime() -
                new Date(orderDate.getFullYear(), 0, 1).getTime()) /
                86400000 +
                1) /
                7,
            )}`;

      order.items.forEach((item) => {
        if (
          "supplier" in item &&
          item.supplier?.manufacturer_id === supplierId
        ) {
          const product = supplierProducts.find(
            (p) => p.product.productId === item.productId,
          );

          if (product) {
            const currentStock = parseFloat(product.product.qty);
            const current = dateMap.get(timeKey) || { stock: 0, sales: 0 };

            dateMap.set(timeKey, {
              stock: currentStock,
              sales: current.sales + parseFloat(item.quantity),
            });
          }
        }
      });
    });

    // 4. Prepare series data with proper Date objects
    const stockSeries: { x: Date; y: number }[] = [];
    const salesSeries: { x: Date; y: number }[] = [];

    dateMap.forEach((value, key) => {
      if (frequency === "daily") {
        const date = new Date(key);
        stockSeries.push({ x: date, y: value.stock });
        salesSeries.push({ x: date, y: value.sales });
      } else {
        const [year, week] = key.split("-W").map(Number);
        const date = new Date(year, 0, 1 + (week - 1) * 7);
        stockSeries.push({ x: date, y: value.stock });
        salesSeries.push({ x: date, y: value.sales });
      }
    });

    // Sort by date
    const sortByDate = (a: { x: Date }, b: { x: Date }) =>
      a.x.getTime() - b.x.getTime();
    stockSeries.sort(sortByDate);
    salesSeries.sort(sortByDate);

    setChartState({
      series: [
        { name: "Stock Level", data: stockSeries },
        { name: "Sales Volume", data: salesSeries },
      ],
      options: {
        ...chartState.options,
        xaxis: {
          type: "datetime",
          title: { text: frequency === "daily" ? "Date" : "Week" },
          labels: {
            format: frequency === "daily" ? "dd MMM" : "WW",
          },
        },
        yaxis: {
          title: { text: "Units" },
          min: 0,
        },
      },
    });
  }, [supplierId, startDate, endDate, frequency]);

  return (
    <div className="border-stroke rounded-lg border bg-white p-6 shadow-lg">
      {/* Chart Header */}
      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
        <h3 className="text-xl font-semibold">Inventory & Sales Trends</h3>

        {/* Frequency Selector */}
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          className="w-32 rounded border p-1 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium">Date Range:</label>
        <div className="flex space-x-2">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Start Date"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End Date"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
        </div>
      </div>

      {/* Chart */}
      <ReactApexChart
        options={chartState.options}
        series={chartState.series}
        type="line"
        height={400}
      />
    </div>
  );
};

export default InventoryTrendChart;
