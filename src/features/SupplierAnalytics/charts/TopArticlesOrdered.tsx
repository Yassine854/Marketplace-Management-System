import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json"; // Make sure your path is correct

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

  // Extend the array if needed
  while (colors.length < num) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return colors.slice(0, num);
};

const TopArticlesOrdered: React.FC<{ supplierId: string }> = ({
  supplierId,
}) => {
  const [state, setState] = useState<{ series: number[]; labels: string[] }>({
    series: [],
    labels: [],
  });

  useEffect(() => {
    const productOrders: Record<string, number> = {};

    supplierData.orders.forEach((order) => {
      order.order.items.forEach((item) => {
        if (item.supplier.manufacturer_id === supplierId) {
          const productName = item.productName;
          const quantity = parseFloat(item.quantity);

          productOrders[productName] =
            (productOrders[productName] || 0) + quantity;
        }
      });
    });

    const totalOrders = Object.values(productOrders).reduce(
      (acc, val) => acc + val,
      0,
    );

    const productNames = Object.keys(productOrders);
    const productPercentages = productNames.map((name) =>
      ((productOrders[name] / totalOrders) * 100).toFixed(2),
    );

    setState({
      series: productPercentages.map(Number),
      labels: productNames.map(
        (name, index) => `${name} (${productPercentages[index]}%)`,
      ),
    });
  }, [supplierId]);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 500,
      background: "#FFFFFF",
    },
    labels: state.labels,
    colors: generateColors(state.labels.length), // Dynamically assign colors
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
      formatter: function (val: number) {
        return `${Number(val).toFixed(1)}%`;
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    title: {
      text: "Most Ordered Products",
      align: "center",
    },
  };

  return (
    <div className="mt-6 w-full bg-white p-4">
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
            ></div>
            <span className="text-sm font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArticlesOrdered;
