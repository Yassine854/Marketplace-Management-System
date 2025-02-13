import React from "react";
import ApexCharts from "react-apexcharts"; // Import the ApexCharts component
import { ApexOptions } from "apexcharts"; // Type for options
import supplierData from "../../../../data_test.json"; // Make sure the path is correct

interface RegionsOrders {
  supplierId: string;
}

const quarters = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
const regions: Record<
  string,
  { Q1: number; Q2: number; Q3: number; Q4: number }
> = {};

// Process the orders to accumulate data for each region and quarter
supplierData.orders.forEach((orderData) => {
  const order = orderData.order;
  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate * 1000)
    : null;

  // Categorize by quarter if deliveryDate exists
  if (deliveryDate) {
    const month = deliveryDate.getMonth() + 1; // months are 0-indexed in JS
    if (month >= 1 && month <= 3) quarters.Q1++;
    else if (month >= 4 && month <= 6) quarters.Q2++;
    else if (month >= 7 && month <= 9) quarters.Q3++;
    else if (month >= 10 && month <= 12) quarters.Q4++;
  }

  // Categorize by region and assign orders to quarters
  const region = order.shippingAddress.region;
  if (region) {
    if (!regions[region]) {
      regions[region] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 }; // Initialize region data
    }

    if (deliveryDate) {
      const month = deliveryDate.getMonth() + 1;
      if (month >= 1 && month <= 3) regions[region].Q1++;
      else if (month >= 4 && month <= 6) regions[region].Q2++;
      else if (month >= 7 && month <= 9) regions[region].Q3++;
      else if (month >= 10 && month <= 12) regions[region].Q4++;
    }
  }
});

// Transform the region data into series for the grouped chart
const regionSeries = Object.keys(regions).map((region) => ({
  name: region,
  data: [
    regions[region].Q1,
    regions[region].Q2,
    regions[region].Q3,
    regions[region].Q4,
  ],
}));

const chartOptions: ApexOptions = {
  chart: {
    type: "bar",
    height: 450,
  },
  plotOptions: {
    bar: {
      columnWidth: "30%", // Adjust width for grouping bars
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
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
    categories: ["Q1", "Q2", "Q3", "Q4"],
  },
  yaxis: {
    title: {
      text: "Number of Orders",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
    floating: true,
    offsetY: -30,
  },
  title: {
    text: "Orders by Region and Quarter",
    align: "center",
  },
  colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6"],
};

// Main component to render the chart
const RegionsOrders = () => (
  <div>
    <ApexCharts
      options={chartOptions}
      series={regionSeries}
      type="bar"
      height={450}
    />
  </div>
);

export default RegionsOrders;
