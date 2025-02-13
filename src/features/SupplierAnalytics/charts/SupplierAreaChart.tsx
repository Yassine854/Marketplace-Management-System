import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json"; // Make sure your path is correct

interface RevenueOverTimeChartProps {
  supplierId: string;
}

const SupplierAreaChart: React.FC<RevenueOverTimeChartProps> = ({
  supplierId,
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState("yearly");

  const calculateRevenue = (order: any) => {
    let revenueByTime: { [key: string]: number } = {};
    if (order.state !== "confirmed") {
      return revenueByTime;
    }

    const currentYear = new Date().getFullYear();
    order.items.forEach((item: any) => {
      if (item.supplier.manufacturer_id === supplierId) {
        const productPrice = parseFloat(item.productPrice);
        const quantityOrdered = parseInt(item.quantity, 10);
        const revenue = productPrice * quantityOrdered;
        const deliveryDate = new Date(order.deliveryDate * 1000);
        const orderDate = new Date(order.createdAt * 1000);

        if (deliveryDate.getFullYear() !== currentYear) {
          return;
        }

        let key;
        switch (timeFilter) {
          case "monthly":
            key = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
            break;
          case "weekly":
            key = `${orderDate.getFullYear()}-W${Math.ceil(
              orderDate.getDate() / 7,
            )}`;
            break;
          case "daily":
            key = orderDate.toISOString().split("T")[0];
            break;
          case "semestrial":
            key = `${orderDate.getFullYear()}-S${
              orderDate.getMonth() < 6 ? 1 : 2
            }`;
            break;
          default:
            key = orderDate.getFullYear().toString();
        }

        if (!revenueByTime[key]) {
          revenueByTime[key] = 0;
        }
        revenueByTime[key] += revenue;
      }
    });

    return revenueByTime;
  };

  useEffect(() => {
    const revenueByTime: { [key: string]: number } = {};
    supplierData.orders.forEach((order: any) => {
      const revenueForOrder = calculateRevenue(order.order);
      for (const time in revenueForOrder) {
        if (!revenueByTime[time]) {
          revenueByTime[time] = 0;
        }
        revenueByTime[time] += revenueForOrder[time];
      }
    });

    const timeLabels = Object.keys(revenueByTime).sort();
    const revenueValues = timeLabels.map((time) => revenueByTime[time] || 0);

    setChartData({
      series: [
        {
          name: "Revenue",
          data: revenueValues,
        },
      ],
      options: {
        chart: {
          type: "area",
          height: 400,
          background: "#FFFFFF",
        },
        xaxis: {
          categories: timeLabels,
          title: {
            text: "Time",
          },
        },
        yaxis: {
          title: {
            text: "Revenue (in TND)",
          },
          labels: {
            formatter: (val: number) => `${val.toFixed(2)} TND`,
          },
        },
        title: {
          text: `Revenue (${timeFilter})`,
          align: "center",
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val.toFixed(2)} TND`,
          },
        },
      },
    });
  }, [supplierId, timeFilter]);

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
