import React, { useState } from "react";
import ApexCharts from "react-apexcharts";
import supplierData from "../../../../data_test.json"; // Ensure the path is correct

interface ProductRevenueLossChartProps {
  supplierId: string;
}

const ProductRevenueLossChart: React.FC<ProductRevenueLossChartProps> = ({
  supplierId,
}) => {
  const [timeFilter, setTimeFilter] = useState("yearly");
  const currentYear = new Date().getFullYear();

  // Filter orders based on the supplierId
  const orders = supplierData.orders.filter((order) =>
    order.order.items.some(
      (item) => item.supplier.manufacturer_id === supplierId,
    ),
  );

  // Group returns revenue loss based on the selected time filter
  const revenueLossByTime: { [key: string]: number } = {};

  orders.forEach((order) => {
    if (order.order.state === "canceled" && order.order.return) {
      order.order.return.returnItems.forEach((returnItem) => {
        const returnDate = new Date(returnItem.returnDate * 1000);
        const returnYear = returnDate.getFullYear();

        const totalCost = parseFloat(returnItem.totalPrice);

        let key;
        switch (timeFilter) {
          case "monthly":
            key = `${returnDate.getFullYear()}-${returnDate.getMonth() + 1}`;
            break;
          case "weekly":
            key = `${returnDate.getFullYear()}-W${Math.ceil(
              returnDate.getDate() / 7,
            )}`;
            break;
          case "daily":
            key = returnDate.toISOString().split("T")[0];
            break;
          case "semestrial":
            key = `${returnDate.getFullYear()}-S${
              returnDate.getMonth() < 6 ? 1 : 2
            }`;
            break;
          default:
            key = returnDate.getFullYear().toString();
        }

        if (!revenueLossByTime[key]) {
          revenueLossByTime[key] = 0;
        }
        revenueLossByTime[key] += totalCost;
      });
    }
  });

  // Sort the time labels
  const timeLabels = Object.keys(revenueLossByTime).sort();
  const revenueValues = timeLabels.map((time) => revenueLossByTime[time] || 0);

  // Prepare the chart data for the bar chart
  const chartData = {
    series: [
      {
        name: "Total Cost of Returns",
        data: revenueValues,
      },
    ],
    options: {
      chart: {
        type: "bar" as "bar",
        height: 300,
        background: "#ffffff",
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: { height: 300 },
              xaxis: { labels: { rotate: -45 } },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: { height: 250 },
              xaxis: { labels: { show: false } },
            },
          },
        ],
      },
      xaxis: {
        categories: timeLabels,
        title: { text: "Time" },
      },
      yaxis: {
        title: { text: "Revenue Loss (TND)" },
        labels: {
          formatter: (val: number) => `${val.toFixed(2)} TND`,
        },
      },
      title: {
        text: `Product Revenue Loss (${timeFilter})`,
        align: "center" as "center",
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(2)} TND`,
        },
      },
    },
  };

  return (
    <div className="mt-6 w-full rounded-lg bg-white p-4">
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
      {revenueValues.length > 0 ? (
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={400}
        />
      ) : (
        <p>No return data available for the selected time filter.</p>
      )}
    </div>
  );
};

export default ProductRevenueLossChart;
