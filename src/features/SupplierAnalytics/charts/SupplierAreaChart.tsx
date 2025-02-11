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

  // Helper function to calculate revenue for each order based on the product price and quantity
  const calculateRevenue = (order: any) => {
    let revenueByMonth: { [key: string]: number } = {};

    // Only consider confirmed orders
    if (order.state !== "confirmed") {
      return revenueByMonth; // If not confirmed, return empty revenue
    }

    // Get current year
    const currentYear = new Date().getFullYear();

    order.items.forEach((item: any) => {
      if (item.supplier.manufacturer_id === supplierId) {
        const productPrice = parseFloat(item.productPrice);
        const quantityOrdered = parseInt(item.quantity, 10);

        // Calculate the revenue for the product in the current order
        const revenue = productPrice * quantityOrdered;

        // Convert the deliveryDate to a Date object
        const deliveryDate = new Date(order.deliveryDate * 1000); // Multiply by 1000 to convert to milliseconds
        console.log(deliveryDate);

        // Check if the delivery date is in the current year
        const deliveryYear = deliveryDate.getFullYear();
        if (deliveryYear !== currentYear) {
          return; // Skip orders with delivery dates not in the current year
        }

        // Convert the order's creation date to a Date object
        const orderDate = new Date(order.createdAt * 1000); // Multiply by 1000 to convert to milliseconds
        const month = orderDate.getMonth(); // 0 = January, 11 = December

        // Accumulate the revenue for this month
        if (!revenueByMonth[month]) {
          revenueByMonth[month] = 0;
        }
        revenueByMonth[month] += revenue;
      }
    });

    return revenueByMonth;
  };

  useEffect(() => {
    const revenueByMonth: { [key: string]: number } = {};

    // Loop through all orders to calculate the revenue by month
    supplierData.orders.forEach((order: any) => {
      const revenueForOrder = calculateRevenue(order.order);
      for (const month in revenueForOrder) {
        if (!revenueByMonth[month]) {
          revenueByMonth[month] = 0;
        }
        revenueByMonth[month] += revenueForOrder[month];
      }
    });

    // Prepare chart data
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const revenueValues = months.map((_, index) => revenueByMonth[index] || 0);

    const currentYear = new Date().getFullYear(); // Get the current year dynamically

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
          height: 400, // Set the height for the area chart
          background: "#FFFFFF",
        },
        xaxis: {
          categories: months, // Set the months as categories on the x-axis
          title: {
            text: "Months",
          },
        },
        yaxis: {
          title: {
            text: "Revenue (in TND)",
          },
          labels: {
            formatter: (val: number) => `${val.toFixed(2)} TND`, // Format y-axis labels as currency
          },
        },
        title: {
          text: `Revenue in ${currentYear}`, // Dynamically set the title with the current year
          align: "center",
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val.toFixed(2)} TND`, // Format tooltip as currency
          },
        },
      },
    });
  }, [supplierId]);

  return (
    <div className="mt-6 w-full bg-white p-4">
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
