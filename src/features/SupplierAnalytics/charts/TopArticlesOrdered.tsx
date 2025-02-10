import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json";

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
  // Extend the array if there are more products than the predefined colors
  while (colors.length < num) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`); // Generate random color
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

    supplierData.forEach((order) => {
      const supplier = order.suppliers.find(
        (s) => s.manufacturer_id === supplierId,
      );
      if (supplier) {
        supplier.items.forEach((item) => {
          productOrders[item.name] =
            (productOrders[item.name] || 0) + item.qty_ordered;
        });
      }
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
        return `${Number(val).toFixed(1)}%`; // ✅ Cast val to number
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <div className="border-stroke dark:border-strokedark dark:bg-boxdark pt-7.5 rounded-sm border bg-white px-5 pb-5 shadow-default">
      <h5 className="mb-3 text-xl font-semibold text-black dark:text-white">
        Most Ordered Products
      </h5>
      <div className="mx-auto flex justify-center">
        <ReactApexChart options={options} series={state.series} type="donut" />
      </div>
    </div>
  );
};

export default TopArticlesOrdered;
