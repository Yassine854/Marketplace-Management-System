import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supplierData from "../../../../data_test.json"; // Ensure the path is correct

// Generate random colors
const generateColors = (num: number): string[] => {
  const colors = [
    "#3C50E0",
    "#6577F3",
    "#8FD0EF",
    "#0FADCF",
    "#FFA500",
    "#FF6347",
    "#32CD32",
    "#FFD700",
    "#FF4500",
    "#8A2BE2",
    "#FF1493",
    "#00CED1",
    "#FF8C00",
    "#DC143C",
    "#9932CC",
    "#20B2AA",
    "#FF6347",
    "#FF7F50",
    "#D2691E",
    "#BC8F8F",
  ];

  while (colors.length < num) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return colors.slice(0, num);
};

const TopArticlesOrdered: React.FC<{ supplierId: string }> = ({
  supplierId,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [state, setState] = useState<{
    series: number[];
    labels: string[];
    ordersCount: number[];
  }>({
    series: [],
    labels: [],
    ordersCount: [],
  });

  const getDateDetails = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  };

  useEffect(() => {
    const productOrders: Record<
      string,
      { quantity: number; orderCount: number }
    > = {};

    supplierData.orders.forEach((order) => {
      const { year, month, day } = getDateDetails(order.order.createdAt);

      if (
        (startDate
          ? new Date(order.order.createdAt * 1000) >= startDate
          : true) &&
        (endDate ? new Date(order.order.createdAt * 1000) <= endDate : true)
      ) {
        order.order.items.forEach((item) => {
          if (item.supplier.manufacturer_id === supplierId) {
            const productName = item.productName;
            const quantity = parseFloat(item.quantity);

            if (!productOrders[productName]) {
              productOrders[productName] = { quantity: 0, orderCount: 0 };
            }

            productOrders[productName].quantity += quantity;
            productOrders[productName].orderCount += 1;
          }
        });
      }
    });

    const totalOrders = Object.values(productOrders).reduce(
      (acc, val) => acc + val.quantity,
      0,
    );
    const productNames = Object.keys(productOrders);
    const productPercentages = productNames.map((name) =>
      ((productOrders[name].quantity / totalOrders) * 100).toFixed(2),
    );

    setState({
      series: productPercentages.map(Number),
      labels: productNames.map((name, index) => `${name}`),
      ordersCount: productNames.map((name) => productOrders[name].orderCount),
    });
  }, [supplierId, startDate, endDate]);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 500,
      background: "#FFFFFF",
    },
    labels: state.labels,
    colors: generateColors(state.labels.length),
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Number(val).toFixed(1)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number, { seriesIndex }: any) => {
          const segment = state.labels[seriesIndex];
          const orderCount = state.ordersCount[seriesIndex];
          return `${orderCount} Orders`;
        },
      },
    },
    title: {
      text: `Most Ordered Products in ${
        startDate && endDate
          ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
          : "All Time"
      }`,
      align: "center",
      style: {
        fontSize: "16px", // Increase font size
        fontWeight: "bold",
        color: "#333", // Title color
      },
    },
  };

  return (
    <div className="mt-6 w-full bg-white p-4">
      {/* Date Range Selection */}
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

      {/* Chart */}
      <div className="mx-auto flex justify-center">
        <ReactApexChart
          options={options}
          series={state.series}
          type="donut"
          height={500}
        />
      </div>

      {/* Product details section */}
      <div className="mt-6 flex flex-wrap justify-center">
        {state.labels.map((label, index) => (
          <div key={index} className="mb-2 flex items-center space-x-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: generateColors(state.labels.length)[index],
              }}
            />
            {/* Display the label with order count */}
            <span className="text-sm ">{label} :</span>
            {/* Display the order count */}
            <span className="text-xs text-gray-600">
              <b>({state.ordersCount[index]} Orders)</b>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArticlesOrdered;
