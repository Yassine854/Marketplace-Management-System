import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import orderData from "../../../../data_test.json";

interface ChartState {
  series: number[];
  options: any;
}

const SupplierCategoryPieChart = ({ supplierId }: { supplierId: string }) => {
  const [chartState, setChartState] = useState<ChartState>({
    series: [],
    options: {
      labels: [],
      colors: [],
      legend: { position: "right" },
      tooltip: { y: { formatter: (val: number) => `${val} products` } },
    },
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    // 1. Get current supplier's categories
    const supplierCategories = new Set(
      orderData.orders.flatMap(({ order }) =>
        order.items
          .filter(
            (item) =>
              "supplier" in item &&
              item.supplier?.manufacturer_id === supplierId,
          )
          .map((item) => item.category.categoryName),
      ),
    );

    // 2. Filter orders by date range
    const filteredOrders = orderData.orders.filter(({ order }) => {
      const orderDate = new Date(order.createdAt * 1000);
      const start = startDate || new Date(0);
      const end = endDate || new Date();
      return orderDate >= start && orderDate <= end;
    });

    // 3. Aggregate ALL products in these categories (including competitors)
    const categoryCounts = filteredOrders
      .flatMap(({ order }) => order.items)
      .filter((item) => supplierCategories.has(item.category.categoryName))
      .reduce(
        (acc, item) => {
          const category = item.category.categoryName;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    // 4. Prepare chart data
    const labels = Object.keys(categoryCounts);
    const series = Object.values(categoryCounts);
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#84CC16",
      "#F97316",
      "#64748B",
    ].slice(0, labels.length);

    setChartState({
      series,
      options: {
        ...chartState.options,
        labels,
        colors,
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total Products",
                  formatter: () => series.reduce((a, b) => a + b, 0).toString(),
                },
              },
            },
          },
        },
      },
    });
  }, [supplierId, startDate, endDate]);

  return (
    <div className="border-stroke rounded-lg border bg-white p-6 shadow-lg">
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

      {/* Chart Title */}
      <h3 className="mb-4 text-xl font-semibold">
        Market Distribution in Your Categories
      </h3>

      {/* Chart */}
      <ReactApexChart
        options={chartState.options}
        series={chartState.series}
        type="donut"
        height={400}
      />
    </div>
  );
};

export default SupplierCategoryPieChart;
