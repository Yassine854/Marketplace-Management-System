import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import supplierData from "../../../../data_test.json";

const quarters = ["Q1", "Q2", "Q3", "Q4"];

const OrdersByRegion: React.FC<{ supplierId: string }> = ({ supplierId }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [regions, setRegions] = useState<
    Record<string, { [key: string]: number }>
  >({});

  useEffect(() => {
    // Reset the regions object when selectedYear changes
    const newRegions: Record<string, { [key: string]: number }> = {};

    // Filter orders by supplierId and selected delivery year
    const filteredOrders = supplierData.orders.filter((orderData) => {
      const order = orderData.order;
      const deliveryDate = order.deliveryDate
        ? new Date(order.deliveryDate * 1000)
        : null;
      // Only include orders where the delivery date year matches the selected year
      return (
        order.items?.some(
          (item) => item.supplier?.manufacturer_id === supplierId,
        ) && deliveryDate?.getFullYear() === selectedYear
      );
    });

    // Process the filtered orders to accumulate data by region and quarter
    filteredOrders.forEach((orderData) => {
      const order = orderData.order;
      const deliveryDate = order.deliveryDate
        ? new Date(order.deliveryDate * 1000)
        : null;
      const region = order.shippingAddress.region;

      if (region && deliveryDate) {
        if (!newRegions[region]) {
          newRegions[region] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
        }

        const month = deliveryDate.getMonth() + 1; // Get month (1-12)
        if (month >= 1 && month <= 3) newRegions[region].Q1++;
        else if (month >= 4 && month <= 6) newRegions[region].Q2++;
        else if (month >= 7 && month <= 9) newRegions[region].Q3++;
        else if (month >= 10 && month <= 12) newRegions[region].Q4++;
      }
    });

    setRegions(newRegions); // Update regions state when orders are processed
  }, [selectedYear, supplierId]); // Re-run the effect whenever selectedYear or supplierId changes

  // Transform data into series for grouped bars
  const quarterSeries = quarters.map((quarter) => ({
    name: quarter,
    data: Object.keys(regions).map((region) => regions[region][quarter] || 0),
  }));

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 450,
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: Object.keys(regions),
      title: {
        text: "Regions",
      },
    },
    yaxis: {
      title: {
        text: "Number of Orders",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    title: {
      text: `Orders by Quarter for Each Region in ${selectedYear}`,
      align: "center",
    },
    colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6"],
  };

  // Handle year change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  // Generate years dynamically (for example, from 2020 to current year)
  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i,
  );

  return (
    <div>
      {/* Year Filter Dropdown */}
      <div className="mb-4 text-center">
        <label className="text-sm font-semibold">Year:</label>
        <select
          className="ml-2 rounded border p-2"
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

      {/* Chart */}
      <ApexCharts
        options={chartOptions}
        series={quarterSeries}
        type="bar"
        height={450}
      />
    </div>
  );
};

export default OrdersByRegion;
