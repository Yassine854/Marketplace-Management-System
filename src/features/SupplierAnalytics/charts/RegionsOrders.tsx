import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import supplierData from "../../../../data_test.json";

// Match color scheme with other components
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

const quarters = ["Q1", "Q2", "Q3", "Q4"];

const OrdersByRegion: React.FC<{ supplierId: string }> = ({ supplierId }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [regions, setRegions] = useState<
    Record<string, { [key: string]: number }>
  >({});
  const [regionDetails, setRegionDetails] = useState<
    { name: string; total: number }[]
  >([]);

  useEffect(() => {
    const processData = () => {
      const newRegions: Record<string, { [key: string]: Set<string> }> = {};

      const filteredOrders = supplierData.orders.filter((orderData) => {
        const order = orderData.order;
        const deliveryDate = order.deliveryDate
          ? new Date(order.deliveryDate * 1000)
          : null;
        return (
          order.items?.some(
            (item) => item.supplier?.manufacturer_id === supplierId,
          ) && deliveryDate?.getFullYear() === selectedYear
        );
      });

      filteredOrders.forEach((orderData) => {
        const order = orderData.order;
        const deliveryDate = order.deliveryDate
          ? new Date(order.deliveryDate * 1000)
          : null;
        const region = order.shippingAddress.region;
        const customerId = order.customerId;

        if (region && deliveryDate && customerId) {
          if (!newRegions[region]) {
            newRegions[region] = {
              Q1: new Set(),
              Q2: new Set(),
              Q3: new Set(),
              Q4: new Set(),
            };
          }

          const month = deliveryDate.getMonth() + 1;
          let quarter: keyof (typeof newRegions)[string] = "Q1";
          if (month >= 4 && month <= 6) quarter = "Q2";
          else if (month >= 7 && month <= 9) quarter = "Q3";
          else if (month >= 10 && month <= 12) quarter = "Q4";

          newRegions[region][quarter].add(customerId);
        }
      });

      // Convert to counts and create details array
      const countRegions = Object.fromEntries(
        Object.entries(newRegions).map(([region, quarters]) => [
          region,
          Object.fromEntries(
            Object.entries(quarters).map(([q, set]) => [q, set.size]),
          ),
        ]),
      );

      const details = Object.entries(countRegions).map(([name, data]) => ({
        name,
        total: Object.values(data).reduce((acc, val) => acc + val, 0),
      }));

      setRegions(countRegions);
      setRegionDetails(details);
    };

    processData();
  }, [selectedYear, supplierId]);

  const quarterSeries = quarters.map((quarter) => ({
    name: quarter,
    data: Object.keys(regions).map((region) => regions[region][quarter] || 0),
  }));

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      fontFamily: "Satoshi, sans-serif",
      background: "#FFFFFF",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#333"],
      },
      formatter: (val: number) => `${val}`,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val} customers`,
      },
    },
    xaxis: {
      categories: Object.keys(regions),
      title: {
        text: "Regions",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Unique Customers",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
    },
    title: {
      text: `Regional Customer Distribution - ${selectedYear}`,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    colors: newColors.slice(0, 4),
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i,
  );

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Year:</span>
          <select
            className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
        <ApexCharts
          options={chartOptions}
          series={quarterSeries}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
};

export default OrdersByRegion;
