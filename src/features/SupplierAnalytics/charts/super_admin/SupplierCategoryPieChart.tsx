import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Product {
  product_id: number;
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

const TotalOrdersByCategoryChart: React.FC = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Total Orders", data: [] as number[] }],
    categories: [] as string[],
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filterOrdersByDate = (
    orders: Order[],
    start: Date | null,
    end: Date | null,
  ): Order[] => {
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      return (
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      );
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:3000";

        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/orders`),
        ]);

        if (!productsRes.ok || !categoriesRes.ok || !ordersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const products: Product[] = await productsRes.json();
        const categories: Category[] = await categoriesRes.json();
        const orders: Order[] = await ordersRes.json();

        // Create map of valid category IDs from categories endpoint
        const validCategoryIds = new Set<number>();
        const categoryMap = new Map<number, string>();
        categories.forEach((c) => {
          validCategoryIds.add(c.categoryId);
          categoryMap.set(c.categoryId, c.nameCategory);
        });

        // Initialize sales data only for valid categories
        const salesData: Record<number, number> = {};
        validCategoryIds.forEach((categoryId) => {
          salesData[categoryId] = 0;
        });

        // Process orders
        const filteredOrders = filterOrdersByDate(orders, startDate, endDate);
        filteredOrders.forEach((order) => {
          if (order.state === "canceled") return;

          order.items.forEach((item) => {
            const product = products.find(
              (p) => p.product_id === item.product_id,
            );
            if (!product?.category_ids) return;

            product.category_ids.forEach((catIdStr) => {
              const catId = Number(catIdStr);
              if (validCategoryIds.has(catId)) {
                salesData[catId] += item.qty_invoiced;
              }
            });
          });
        });

        // Convert to chart data format
        const categoriesList = Array.from(categoryMap.values());
        const totalOrdersData = Array.from(validCategoryIds).map(
          (catId) => salesData[catId],
        );

        setChartData({
          series: [{ name: "Total Orders", data: totalOrdersData }],
          categories: categoriesList,
        });
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError(
          "Failed to load data. Please refresh or check your connection.",
        );
        setChartData({
          series: [{ name: "Total Orders", data: [] }],
          categories: [],
        });
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">Période:</label>
        <div className="flex gap-3">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Date Début"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="Date Fin"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="MMM d, yyyy"
            isClearable
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-inner">
        <h3 className="mb-6 text-center text-2xl font-semibold">
          Total des Commandes par Catégorie
        </h3>
        {chartData.series[0]?.data.length > 0 ? (
          <ReactApexChart
            options={{
              chart: {
                type: "bar",
                height: 350,
                toolbar: { show: false },
              },
              xaxis: {
                categories: chartData.categories,
                labels: {
                  style: { fontSize: "14px" },
                  rotate: -45,
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  columnWidth: "60%",
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}`,
                offsetY: -20,
                style: {
                  fontSize: "12px",
                  colors: ["#000"],
                },
              },
              colors: ["#3B82F6"],
            }}
            series={chartData.series}
            type="bar"
            height={450}
          />
        ) : (
          <div className="flex h-[450px] items-center justify-center text-gray-500">
            No sales data available for selected period
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalOrdersByCategoryChart;
