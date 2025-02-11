import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json";

interface ProductRevenueLossChartProps {
  supplierId: string; // Accept supplierId as a prop
}

interface ChartState {
  series: Array<{ name: string; data: number[] }>;
  options: {
    chart: { type: "bar"; height: number; background: string }; // Specify background property for chart
    xaxis: { categories: string[] };
    yaxis: { title: { text: string } };
    tooltip: { y: { formatter: (val: number) => string } };
    title: { text: string; align: "center" | "left" | "right" }; // Restrict align to specific values
  };
}

const ProductRevenueLossChart: React.FC<ProductRevenueLossChartProps> = ({
  supplierId,
}) => {
  const [chartData, setChartData] = useState<ChartState | null>(null);

  // Helper function to calculate the revenue loss for each product due to returns
  const calculateRevenueLoss = (order: any) => {
    let lossByProduct: { [key: string]: number } = {};

    // Loop through each item in the order
    order.items.forEach((item: any) => {
      if (item.supplier.manufacturer_id === supplierId) {
        const productName = item.productName;
        const productPrice = parseFloat(item.productPrice);
        const quantityOrdered = parseInt(item.quantity, 10);
        const returnedQuantity = item.return
          ? item.return.type === "partial"
            ? item.return.returned_products
            : quantityOrdered
          : 0;

        // Calculate the loss if there was a return
        const loss = productPrice * returnedQuantity;

        if (loss > 0) {
          // Accumulate the loss for this product
          if (!lossByProduct[productName]) {
            lossByProduct[productName] = 0;
          }
          lossByProduct[productName] += loss;
        }
      }
    });

    return lossByProduct;
  };

  useEffect(() => {
    const revenueLossByProduct: { [key: string]: number } = {};

    // Loop through all orders to calculate revenue loss
    supplierData.orders.forEach((order: any) => {
      const lossByProduct = calculateRevenueLoss(order.order);
      for (const product in lossByProduct) {
        if (!revenueLossByProduct[product]) {
          revenueLossByProduct[product] = 0;
        }
        revenueLossByProduct[product] += lossByProduct[product];
      }
    });

    // Prepare chart data
    const productNames = Object.keys(revenueLossByProduct);
    const revenueLossValues = productNames.map(
      (product) => revenueLossByProduct[product],
    );

    // Set the chart data state
    setChartData({
      series: [
        {
          name: "Loss Due to Returns",
          data: revenueLossValues,
        },
      ],
      options: {
        chart: {
          type: "bar", // Explicitly specify the type here
          height: 500, // Set a large height here (custom height)
          background: "#FFFFFF", // Set background to white
        },
        xaxis: {
          categories: productNames,
        },
        yaxis: {
          title: {
            text: "Revenue Loss (in TND)",
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val.toFixed(2)} TND`,
          },
        },
        title: {
          text: "Loss Due to Products Return",
          align: "center", // This should be valid now
        },
      },
    });
  }, [supplierId]);

  return (
    <div className="mt-6 w-full bg-white p-4">
      {" "}
      {/* Container with white background and padding */}
      {chartData ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={500} // Chart will occupy large height
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default ProductRevenueLossChart;
