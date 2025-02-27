import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Select from "react-select";

interface Product {
  stock_item: {
    qty: number;
    is_in_stock: boolean;
    [key: string]: any;
  };
  product_id: number;
  name: string;
  category_ids?: string[];
  manufacturer: string;
  created_at: string;
  [key: string]: any;
}

interface Category {
  _id: string;
  categoryId: number;
  nameCategory: string;
}

interface OrderItem {
  product_id: number;
  qty_invoiced: number;
  date: Date;
}

interface ChartState {
  series: { name: string; data: { x: Date; y: number }[] }[];
  options: ApexOptions;
}

const InventoryTrendChart = () => {
  const [chartState, setChartState] = useState<ChartState>({
    series: [],
    options: {
      chart: {
        type: "line",
        height: 500,
        zoom: { enabled: true },
        animations: { enabled: false },
        toolbar: { show: true },
      },
      xaxis: { type: "datetime" },
      yaxis: { title: { text: "Unités" } },
      stroke: { curve: "straight", width: 1 },
      tooltip: {
        x: { format: "dd MMM yyyy" },
        shared: true,
        intersect: false,
      },
      dataLabels: { enabled: false },
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [salesMap, setSalesMap] = useState<Map<number, OrderItem[]>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const processedSeries = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          p.stock_item.is_in_stock &&
          (selectedCategory
            ? p.category_ids?.includes(selectedCategory)
            : true),
      )
      .map((product) => {
        const sales = salesMap.get(product.product_id) || [];
        const inventoryMap = new Map<number, number>();
        let currentInventory = product.stock_item.qty;

        // Reconstruct inventory timeline
        [...sales]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .forEach((sale) => {
            currentInventory += sale.qty_invoiced;
            inventoryMap.set(sale.date.getTime(), currentInventory);
          });

        // Add current stock
        inventoryMap.set(new Date().getTime(), product.stock_item.qty);

        return {
          name: product.name,
          data: Array.from(inventoryMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([timestamp, qty]) => ({
              x: new Date(timestamp),
              y: qty,
            })),
        };
      });
  }, [allProducts, salesMap, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/api/products"),
          fetch("http://localhost:3000/api/orders"),
          fetch("http://localhost:3000/api/categories"),
        ]);

        if (!productsRes.ok || !ordersRes.ok || !categoriesRes.ok) {
          throw new Error("Data loading failed");
        }

        const products: Product[] = await productsRes.json();
        const orders: any[] = await ordersRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        // Create sales map
        const newSalesMap = new Map<number, OrderItem[]>();
        orders.forEach((order) => {
          if (order.state !== "complete") return;
          const orderDate = new Date(order.created_at);
          order.items.forEach((item: any) => {
            const entries = newSalesMap.get(item.product_id) || [];
            entries.push({
              product_id: item.product_id,
              qty_invoiced: item.qty_invoiced,
              date: orderDate,
            });
            newSalesMap.set(item.product_id, entries);
          });
        });

        setAllProducts(products.filter((p) => p.stock_item.is_in_stock));
        setSalesMap(newSalesMap);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load inventory data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      value: category.categoryId.toString(), // Match product category_ids format
      label: category.nameCategory,
    }));
  }, [categories]);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Inventory Trends by Category</h2>
        <div className="min-w-[300px]">
          <Select
            options={categoryOptions}
            onChange={(selected) =>
              setSelectedCategory(selected?.value || null)
            }
            placeholder="Select a category..."
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-96 items-center justify-center text-gray-500">
          Loading inventory data...
        </div>
      ) : processedSeries.length > 0 ? (
        <ReactApexChart
          options={chartState.options}
          series={processedSeries}
          type="line"
          height={500}
        />
      ) : (
        <div className="flex h-96 items-center justify-center text-gray-500">
          {selectedCategory
            ? "No products found in this category"
            : "Select a category to view inventory trends"}
        </div>
      )}
    </div>
  );
};

export default InventoryTrendChart;
