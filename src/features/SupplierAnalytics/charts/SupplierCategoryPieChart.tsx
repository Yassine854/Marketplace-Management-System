import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Product {
  id: number;
  name: string;
  manufacturer: string;
  category_ids: string[];
}

interface Category {
  categoryId: number;
  nameCategory: string;
}

interface Order {
  _id: string;
  created_at: string;
  state: string;
  items: { product_id: number; qty_invoiced: number }[];
}

interface ChartState {
  series: number[];
  options: any;
}

interface Props {
  supplierId: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

const SupplierCategoryPieChart: React.FC<Props> = ({
  supplierId,
  startDate: propStartDate,
  endDate: propEndDate,
}) => {
  const [chartState, setChartState] = useState<ChartState>({
    series: [],
    options: {
      labels: [],
      colors: [],
      chart: {
        type: "donut",
        height: 350,
        fontFamily: "Satoshi, sans-serif",
        background: "#FFFFFF",
      },
      legend: { show: false },
      plotOptions: {
        pie: {
          donut: { size: "65%" },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    },
  });

  const [startDate, setStartDate] = useState<Date | null>(
    propStartDate || null,
  );
  const [endDate, setEndDate] = useState<Date | null>(propEndDate || null);

  useEffect(() => {
    setStartDate(propStartDate || null);
    setEndDate(propEndDate || null);
  }, [propStartDate, propEndDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("http://localhost:3000/api/products");
        const categoriesRes = await fetch(
          "http://localhost:3000/api/categories",
        );
        const ordersRes = await fetch("http://localhost:3000/api/orders");

        const products: Product[] = await productsRes.json();
        const categories: Category[] = await categoriesRes.json();
        const orders: Order[] = await ordersRes.json();

        // Filter products for the given supplierId
        const filteredProducts = products.filter(
          (product) => product.manufacturer === supplierId,
        );
        const categoryCounts: Record<string, number> = {};

        // Map categories by their ID for quick lookup
        const categoryMap = new Map<number, string>();
        categories.forEach((category) => {
          categoryMap.set(category.categoryId, category.nameCategory);
        });

        // Loop through the orders and count categories
        orders.forEach((order) => {
          if (order.state !== "canceled") {
            const orderDate = new Date(order.created_at);
            if (
              (!startDate || orderDate >= startDate) &&
              (!endDate || orderDate <= endDate)
            ) {
              order.items.forEach((item) => {
                const product = filteredProducts.find(
                  (p) => p.id === item.product_id,
                );
                if (product) {
                  product.category_ids.forEach((categoryIdStr) => {
                    const categoryId = Number(categoryIdStr); // Convert to number
                    const categoryName = categoryMap.get(categoryId);
                    if (categoryName) {
                      categoryCounts[categoryName] =
                        (categoryCounts[categoryName] || 0) + item.qty_invoiced;
                    }
                  });
                }
              });
            }
          }
        });

        // Get the labels (category names) and series (total quantity sold in that category)
        const labels = Object.keys(categoryCounts);
        const series = Object.values(categoryCounts);

        // Ensure colors are mapped to the number of categories
        const colors = [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
          "#06B6D4",
          "#84CC16",
          "#F97316",
          "#64748B",
        ].slice(0, labels.length);

        setChartState({
          series,
          options: { ...chartState.options, labels, colors },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [supplierId, startDate, endDate]);

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">Période:</label>
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
          Category Distribution by Orders
        </h3>
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="donut"
          height={350}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {chartState.options.labels.map((label: string, index: number) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="mt-1 h-5 w-5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: chartState.options.colors[index] }}
            />
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="break-words font-medium text-gray-800">
                  {label}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {chartState.series[index]} commmandes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierCategoryPieChart;
