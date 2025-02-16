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

    // Convert Sets to counts
    const countRegions = Object.fromEntries(
      Object.entries(newRegions).map(([region, quarters]) => [
        region,
        Object.fromEntries(
          Object.entries(quarters).map(([q, set]) => [q, set.size]),
        ),
      ]),
    );

    setRegions(countRegions);
  }, [selectedYear, supplierId]);

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
        text: "Number of Unique Customers",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    title: {
      text: `Unique Customers for Each Region in ${selectedYear}`,
      align: "center",
    },
    colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6"],
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i,
  );

  return (
    <div>
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
