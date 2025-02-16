import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json";

interface RevenueOverTimeChartProps {
  supplierId: string;
}

const SupplierAreaChart: React.FC<RevenueOverTimeChartProps> = ({
  supplierId,
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState("yearly");

  // Get supplier products and pre-cache costPrice/qty
  const supplierProducts = supplierData.products.filter(
    (p: any) => p.product.supplier?.manufacturer_id === supplierId,
  );

  // Pre-map products for quick lookup
  const productMap = new Map(
    supplierProducts.map((p: any) => [
      p.product.productId,
      {
        costPrice: parseFloat(p.product.costPrice),
        qty: parseFloat(p.product.qty),
        orderedQty: 0,
      },
    ]),
  );

  useEffect(() => {
    const timeSeries: { [key: string]: number } = {};

    // First pass: Calculate base turnover from inventory
    const baseTurnover = Array.from(productMap.values()).reduce(
      (sum, product) => sum + product.costPrice * product.qty,
      0,
    );

    // Second pass: Process orders and accumulate ordered quantities
    supplierData.orders.forEach(({ order }: any) => {
      if (order.state !== "confirmed") return;

      const orderDate = new Date(order.createdAt * 1000);
      const timeKey = getTimeKey(orderDate);

      order.items.forEach((item: any) => {
        if (item.supplier.manufacturer_id !== supplierId) return;

        const product = productMap.get(item.productId);
        if (!product) return;

        const orderedQty = parseFloat(item.quantity);
        product.orderedQty += orderedQty;

        const turnoverContribution = product.costPrice * orderedQty;
        timeSeries[timeKey] = (timeSeries[timeKey] || 0) + turnoverContribution;
      });
    });

    // Combine base turnover with time-based contributions
    const timeLabels = Object.keys(timeSeries).sort();
    const turnoverData = timeLabels.map(
      (time) => baseTurnover + timeSeries[time],
    );

    setChartData({
      series: [{ name: "Turnover", data: turnoverData }],
      options: getChartOptions(timeLabels, timeFilter),
    });
  }, [supplierId, timeFilter]);

  // Helper function to generate time keys
  const getTimeKey = (date: Date) => {
    switch (timeFilter) {
      case "monthly":
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
      case "weekly":
        return `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      case "daily":
        return date.toISOString().split("T")[0];
      case "semestrial":
        return `${date.getFullYear()}-S${date.getMonth() < 6 ? 1 : 2}`;
      default:
        return date.getFullYear().toString();
    }
  };

  // Chart options configuration
  const getChartOptions = (
    categories: string[],
    filter: string,
  ): ApexOptions => ({
    chart: {
      type: "area",
      height: 400,
      background: "#FFFFFF",
    },
    xaxis: {
      categories,
      title: { text: "Time" },
    },
    yaxis: {
      title: { text: "Turnover (TND)" },
      labels: { formatter: (val: number) => `${val.toFixed(0)} TND` },
    },
    title: {
      text: `Turnover (${filter})`,
      align: "center",
    },
    tooltip: {
      y: { formatter: (val: number) => `${val.toFixed(2)} TND` },
    },
  });

  return (
    <div className="mt-6 w-full bg-white p-4">
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border p-2"
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
          <option value="semestrial">Semestrial</option>
        </select>
      </div>
      {chartData ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={400}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default SupplierAreaChart;
