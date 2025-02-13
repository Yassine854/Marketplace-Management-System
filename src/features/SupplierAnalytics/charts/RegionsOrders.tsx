import React from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import supplierData from "../../../../data_test.json";

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const regions: Record<string, { [key: string]: number }> = {};

// Process orders to accumulate data for each region and quarter
supplierData.orders.forEach((orderData) => {
  const order = orderData.order;
  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate * 1000)
    : null;
  const region = order.shippingAddress.region;

  if (region && deliveryDate) {
    if (!regions[region]) {
      regions[region] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    }

    const month = deliveryDate.getMonth() + 1;
    if (month >= 1 && month <= 3) regions[region].Q1++;
    else if (month >= 4 && month <= 6) regions[region].Q2++;
    else if (month >= 7 && month <= 9) regions[region].Q3++;
    else if (month >= 10 && month <= 12) regions[region].Q4++;
  }
});

// Transform data into series for grouped bars
const quarterSeries = quarters.map((quarter) => ({
  name: quarter,
  data: Object.keys(regions).map((region) => regions[region][quarter] || 0),
}));

const chartOptions: ApexOptions = {
  chart: {
    type: "bar",
    height: 450,
  },
  plotOptions: {
    bar: {
      columnWidth: "45%",
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "12px",
      colors: ["#000"],
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
    categories: Object.keys(regions),
    title: {
      text: "Regions",
    },
  },
  yaxis: {
    title: {
      text: "Number of Orders",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
  },
  title: {
    text: "Orders by Quarter for Each Region",
    align: "center",
  },
  colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A6"],
};

const OrdersByRegion = () => (
  <div>
    <ApexCharts
      options={chartOptions}
      series={quarterSeries}
      type="bar"
      height={450}
    />
  </div>
);

export default OrdersByRegion;
