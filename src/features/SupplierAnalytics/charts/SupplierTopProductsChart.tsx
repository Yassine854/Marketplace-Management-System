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
    series: [],
    options: {
      chart: { type: "bar" },
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: [] },
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
      .slice(0, 10); // Top 10

    setChartState({
      series: [
        {
          name: metric === "volume" ? "Units Sold" : "Revenue (TND)",
          data: sortedProducts.map((p) =>
            metric === "volume" ? p.volume : p.revenue,
          ),
        },
      ],
      options: {
        ...chartState.options,
        xaxis: {
          categories: sortedProducts.map((p) => p.name),
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
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="MMM dd, yyyy"
            placeholderText="Start Date"
            className="w-32 rounded border p-1 text-sm"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="MMM dd, yyyy"
            placeholderText="End Date"
            className="w-32 rounded border p-1 text-sm"
            isClearable
          />
        </div>
      </div>

      {/* Chart */}
      <ReactApexChart
        options={chartState.options}
        series={chartState.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default SupplierTopProductsChart;
