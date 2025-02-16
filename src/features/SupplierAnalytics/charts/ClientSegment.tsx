import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supplierData from "../../../../data_test.json";

const ClientSegment: React.FC<{ supplierId: string }> = ({ supplierId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    let filteredOrders = supplierData.orders.filter((order: any) => {
      return (
        order.order.state === "confirmed" &&
        order.order.status === "valid" &&
        order.order.items.some(
          (item: any) => item.supplier.manufacturer_id === supplierId,
        )
      );
    });

    if (startDate) {
      filteredOrders = filteredOrders.filter((order: any) => {
        const deliveredAt = new Date(order.order.deliveryDate * 1000);
        return deliveredAt >= startDate;
      });
    }

    if (endDate) {
      filteredOrders = filteredOrders.filter((order: any) => {
        const deliveredAt = new Date(order.order.deliveryDate * 1000);
        return deliveredAt <= endDate;
      });
    }

    const processedCustomersBySegment: Record<string, Set<string>> = {};
    const segmentTypeCounts: Record<string, number> = {};
    const allCustomers = new Set<string>();

    filteredOrders.forEach((order: any) => {
      const customerId = order.order.customerId;
      const segmentType = order.order.segment_type;

      if (segmentType) {
        if (!processedCustomersBySegment[segmentType]) {
          processedCustomersBySegment[segmentType] = new Set();
        }

        if (!processedCustomersBySegment[segmentType].has(customerId)) {
          processedCustomersBySegment[segmentType].add(customerId);
          segmentTypeCounts[segmentType] =
            (segmentTypeCounts[segmentType] || 0) + 1;
          allCustomers.add(customerId);
        }
      }
    });

    // Calculate total unique customers across all segments
    setTotalCustomers(allCustomers.size);

    // Prepare chart data
    const chartSeries = Object.values(segmentTypeCounts);
    const chartLabels = Object.keys(segmentTypeCounts).map(
      (label) => `${label} (${segmentTypeCounts[label]})`,
    );

    setChartData({
      series: chartSeries,
      options: {
        chart: {
          type: "pie",
          width: "100%",
          events: {
            dataPointSelection: (
              event: any,
              chartContext: any,
              config: any,
            ) => {
              console.log(
                "Selected segment:",
                chartLabels[config.dataPointIndex],
              );
            },
          },
        },
        labels: chartLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: "100%" },
              legend: { position: "bottom" },
            },
          },
        ],
        title: {
          text: `Client Segments - Total Unique Customers: ${totalCustomers}`,
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
          },
        },
        tooltip: {
          y: {
            formatter: (value: number) => `${value} unique customers`,
          },
        },
      },
    });
  }, [supplierId, startDate, endDate, totalCustomers]);

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex flex-col space-y-2">
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
      </div>

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
  );
};

export default ClientSegment;
