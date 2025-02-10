import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import supplierData from "../../../../data_test.json";

const currentYear = new Date().getFullYear();
const months = Array.from(
  { length: 12 },
  (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, "0")}-01`,
);

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  stroke: { curve: "straight" },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "#EDEFF1",
    strokeDashArray: 5,
  },
  title: {
    text: "Supplier Revenue Over Time",
    align: "left",
  },
  subtitle: {
    text: "Total Revenue per Month",
    align: "left",
  },
  xaxis: {
    type: "datetime",
    categories: months, // Dynamic months for the current year
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    opposite: true,
    min: 0,
  },
};

interface ChartState {
  series: {
    name: string;
    data: number[];
  }[];
}

const SupplierAreaChart: React.FC<{ supplierId: string }> = ({
  supplierId,
}) => {
  const [state, setState] = useState<ChartState>({
    series: [{ name: "Revenue", data: [] }],
  });

  useEffect(() => {
    const monthlyRevenue: Record<string, number> = {};

    supplierData.forEach((order) => {
      const supplier = order.suppliers.find(
        (s) => s.manufacturer_id === supplierId,
      );
      if (supplier) {
        const orderDate = (
          order.supplier_orders_summary.by_supplier as Record<string, any>
        )[supplierId]?.last_order_date;

        if (orderDate) {
          const month = orderDate.substring(0, 7); // Extract YYYY-MM format

          let revenueAfterDiscounts = supplier.totals.grand_total;

          // Track products with discounts and adjust revenue
          supplier.items.forEach((item) => {
            if (item.discount && item.discount.discount_amount > 0) {
              // Subtract the discount amount from the total revenue
              revenueAfterDiscounts -= item.discount.discount_amount;
            }
          });

          // Accumulate the adjusted revenue for the given month
          monthlyRevenue[month] =
            (monthlyRevenue[month] || 0) + revenueAfterDiscounts;
        }
      }
    });

    // Format data to match dynamic months
    const formattedData = months.map(
      (month) => monthlyRevenue[month.slice(0, 7)] || 0,
    );

    setState({ series: [{ name: "Revenue", data: formattedData }] });
  }, [supplierId]);

  return (
    <div className="border-stroke pt-7.5 dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white px-5 pb-5 shadow-default">
      <div id="areaChart" className="-ml-5">
        <ReactApexChart
          options={options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default SupplierAreaChart;
