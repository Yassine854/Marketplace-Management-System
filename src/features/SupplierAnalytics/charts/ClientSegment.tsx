import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supplierData from "../../../../data_test.json";

const ClientSegment: React.FC<{ supplierId: string }> = ({ supplierId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null); // Start date for filtering
  const [endDate, setEndDate] = useState<Date | null>(null); // End date for filtering

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    // Step 1: Filter orders based on the criteria and supplierId as manufacturer_id
    let filteredOrders = supplierData.orders.filter((order: any) => {
      return (
        order.order.state === "confirmed" &&
        order.order.status === "valid" &&
        order.order.items.some(
          (item: any) => item.supplier.manufacturer_id === supplierId,
        )
      );
    });

    // Step 2: Filter orders by date range if startDate and endDate are provided
    if (startDate) {
      filteredOrders = filteredOrders.filter((order: any) => {
        const deliveredAt = new Date(order.order.deliveryDate * 1000); // Convert from Unix timestamp to Date object
        return deliveredAt >= startDate;
      });
    }

    if (endDate) {
      filteredOrders = filteredOrders.filter((order: any) => {
        const deliveredAt = new Date(order.order.deliveryDate * 1000); // Convert from Unix timestamp to Date object
        return deliveredAt <= endDate;
      });
    }

    // Step 3: Track unique customerIds per segment_type
    const processedCustomersBySegment: Record<string, Set<string>> = {}; // Map to track unique customerIds per segment_type
    const segmentTypeCounts: Record<string, number> = {};

    filteredOrders.forEach((order: any) => {
      const customerId = order.order.customerId; // Use customerId from the order
      const segmentType = order.order.segment_type; // Get the segment type

      // Ensure segmentType exists and initialize if necessary
      if (segmentType) {
        if (!processedCustomersBySegment[segmentType]) {
          processedCustomersBySegment[segmentType] = new Set();
        }

        // Only count the customer once per segment_type
        if (!processedCustomersBySegment[segmentType].has(customerId)) {
          processedCustomersBySegment[segmentType].add(customerId);
          segmentTypeCounts[segmentType] =
            (segmentTypeCounts[segmentType] || 0) + 1;
        }
      }
    });

    // Step 4: Prepare data for the chart
    const chartSeries = Object.values(segmentTypeCounts);
    const chartLabels = Object.keys(segmentTypeCounts);

    setChartData({
      series: chartSeries,
      options: {
        chart: {
          type: "pie",
          width: "100%",
        },
        labels: chartLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%",
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        title: {
          text: "Segment Type Distribution (Unique Customers)",
          align: "center",
        },
      },
    });
  }, [supplierId, startDate, endDate]); // Re-run the effect when supplierId, startDate, or endDate changes

  return (
    <div>
      <div className="mb-4 text-center">
        <label className="text-sm font-semibold">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)} // Handle null
          dateFormat="yyyy/MM/dd"
          className="ml-2 w-24 rounded border p-1 text-xs" // Added width class for smaller width
        />

        <label className="ml-4 text-sm font-semibold">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)} // Handle null
          dateFormat="yyyy/MM/dd"
          className="ml-2 w-24 rounded border p-1 text-xs" // Added width class for smaller width
        />
      </div>

      {chartData ? (
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width="400"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ClientSegment;
