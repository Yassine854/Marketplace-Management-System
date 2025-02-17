import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supplierData from "../../../../data_test.json";

// Use the same color scheme as TopArticlesOrdered
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

const ClientSegment: React.FC<{ supplierId: string }> = ({ supplierId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [segmentDetails, setSegmentDetails] = useState<
    { label: string; count: number }[]
  >([]);

  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);

  useEffect(() => {
    const filteredOrders = supplierData.orders.filter((order: any) => {
      const orderDate = new Date(order.order.deliveryDate * 1000);
      return (
        order.order.state === "confirmed" &&
        order.order.status === "valid" &&
        order.order.items.some(
          (item: any) => item.supplier.manufacturer_id === supplierId,
        ) &&
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      );
    });

    const segments: Record<string, { count: number; customers: Set<string> }> =
      {};
    const allCustomers = new Set<string>();

    filteredOrders.forEach((order: any) => {
      const segment = order.order.segment_type;
      const customerId = order.order.customerId;

      if (segment) {
        if (!segments[segment]) {
          segments[segment] = { count: 0, customers: new Set() };
        }

        if (!segments[segment].customers.has(customerId)) {
          segments[segment].customers.add(customerId);
          segments[segment].count++;
          allCustomers.add(customerId);
        }
      }
    });

    setTotalCustomers(allCustomers.size);

    const segmentList = Object.entries(segments).map(([label, data]) => ({
      label,
      count: data.count,
    }));

    setSegmentDetails(segmentList);

    setChartData({
      series: segmentList.map((item) => item.count),
      options: {
        chart: {
          type: "pie",
          height: 400,
          fontFamily: "Satoshi, sans-serif",
          events: {
            dataPointSelection: (
              event: any,
              chartContext: any,
              config: any,
            ) => {
              console.log(
                "Selected segment:",
                segmentList[config.dataPointIndex].label,
              );
            },
          },
        },
        colors: newColors,
        labels: segmentList.map((item) => item.label),
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(1)}%`,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
        tooltip: {
          y: {
            formatter: (value: number) => `${value} customers`,
          },
        },
        title: {
          text: `Client Segments - Total Unique Customers: ${allCustomers.size}`,
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
          },
        },
      },
    });
  }, [supplierId, startDate, endDate]);

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">Date Range:</label>
        <div className="flex gap-3">
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

      {/* Chart Section */}
      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
        {chartData ? (
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="pie"
            height={350}
          />
        ) : (
          <p className="text-center text-gray-500">
            Loading customer segments...
          </p>
        )}
      </div>

      {/* Segment List Section */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {segmentDetails.map((segment, index) => (
          <div
            key={segment.label}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="mt-1 h-5 w-5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: newColors[index % newColors.length] }}
            />
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="break-words font-medium text-gray-800">
                  {segment.label}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {segment.count} customers
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSegment;
