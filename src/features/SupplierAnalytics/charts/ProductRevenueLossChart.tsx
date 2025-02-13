import React from "react";
import ApexCharts from "react-apexcharts";
import supplierData from "../../../../data_test.json"; // Ensure the path is correct

interface ProductRevenueLossChartProps {
  supplierId: string;
}

const ProductRevenueLossChart: React.FC<ProductRevenueLossChartProps> = ({
  supplierId,
}) => {
  const currentYear = new Date().getFullYear(); // Get the current year

  // Filter orders based on the supplierId
  const orders = supplierData.orders.filter((order) =>
    order.order.items.some(
      (item) => item.supplier.manufacturer_id === supplierId,
    ),
  );

  // Prepare the data for the chart
  const data = orders.flatMap((order) =>
    order.order.state === "canceled" && order.order.return
      ? order.order.return.returnItems
          .map((returnItem) => {
            const returnDate = new Date(returnItem.returnDate * 1000);
            const returnYear = returnDate.getFullYear();

            return returnYear === currentYear && returnItem.productId
              ? {
                  productName: returnItem.productName,
                  returnedQuantity: parseInt(returnItem.quantity, 10),
                  totalCost: parseFloat(returnItem.totalPrice),
                }
              : null;
          })
          .filter(
            (
              item,
            ): item is {
              productName: string;
              returnedQuantity: number;
              totalCost: number;
            } => item !== null,
          )
      : [],
  );

  // Prepare the chart data for the bar chart
  const chartData = {
    series: [
      {
        name: "Total Cost of Returns",
        data: data.map((item) => item.totalCost),
      },
    ],
    options: {
      chart: {
        type: "bar" as "bar",
        height: 300,
        background: "#ffffff", // Set white background
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300,
              },
              xaxis: {
                labels: {
                  rotate: -45,
                },
              },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 250,
              },
              xaxis: {
                labels: {
                  show: false,
                },
              },
            },
          },
        ],
      },
      xaxis: {
        categories: data.map((item) => item.productName),
      },
      title: {
        text: "Product Revenue Loss (Returns)",
        align: "center" as "center",
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default ProductRevenueLossChart;
