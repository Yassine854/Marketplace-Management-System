import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const newColors = [
  "#FF6B6B",
  "#FFD700",
  "#4ECDC4",
  "#A78BFA",
  "#E84393",
  "#6C5CE7",
  "#839788",
  "#D95D39",
  "#00CEC9",
  "#FF9F43",
];

interface OrderItem {
  product_id: number;
  qty_invoiced: number;
}

interface Order {
  created_at: string;
  state: string;
  items: OrderItem[];
}

interface Product {
  id: number;
  name: string;
  manufacturer: string;
}

interface Props {
  supplierId: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

const TopArticlesOrdered: React.FC<Props> = ({
  supplierId,
  startDate: propStartDate,
  endDate: propEndDate,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    propStartDate || null,
  );
  const [endDate, setEndDate] = useState<Date | null>(propEndDate || null);
  const [state, setState] = useState<{
    series: number[];
    labels: string[];
    ordersCount: number[];
  }>({ series: [], labels: [], ordersCount: [] });

  useEffect(() => {
    setStartDate(propStartDate || null);
    setEndDate(propEndDate || null);
  }, [propStartDate, propEndDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("http://localhost:3000/api/products");
        const ordersRes = await fetch("http://localhost:3000/api/orders");

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const filteredProducts = products.filter(
          (product: Product) => product.manufacturer === supplierId,
        );
        const productOrders: Record<string, number> = {};

        orders.forEach((order: Order) => {
          if (order.state !== "canceled") {
            const orderDate = new Date(order.created_at);
            if (
              (!startDate || orderDate >= startDate) &&
              (!endDate || orderDate <= endDate)
            ) {
              order.items.forEach((item) => {
                const product = filteredProducts.find(
                  (p: Product) => p.id === item.product_id,
                );
                if (product) {
                  if (!productOrders[product.name]) {
                    productOrders[product.name] = 0;
                  }
                  productOrders[product.name]++;
                }
              });
            }
          }
        });

        const totalOrders =
          Object.values(productOrders).reduce((acc, count) => acc + count, 0) ||
          1;
        const labels = Object.keys(productOrders);
        setState({
          series: labels.map((name) =>
            Number(((productOrders[name] / totalOrders) * 100).toFixed(2)),
          ),
          labels,
          ordersCount: labels.map((name) => productOrders[name]),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [supplierId, startDate, endDate]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 400,
      fontFamily: "Satoshi, sans-serif",
      background: "#FFFFFF",
    },
    labels: state.labels,
    colors: newColors.slice(0, state.labels.length),
    legend: { show: false },
    plotOptions: { pie: { donut: { size: "65%" } } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    tooltip: {
      y: {
        formatter: (_, { seriesIndex }) =>
          `${state.ordersCount[seriesIndex]} commandes`,
      },
    },
  };

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">Période :</label>
        <div className="flex gap-3">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Date début"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="Date fin"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
        <h3 className="mb-6 text-center text-2xl font-semibold">
          Produits les plus commandés
        </h3>
        <ReactApexChart
          options={options}
          series={state.series}
          type="donut"
          height={350}
        />
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {state.labels.map((product, index) => (
          <div
            key={product}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="mt-1 h-5 w-5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: newColors[index % newColors.length] }}
            />
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="break-words font-medium text-gray-800">
                  {product}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {state.ordersCount[index]} commandes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArticlesOrdered;
