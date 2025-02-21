import React, { useEffect, useState } from "react";
import orderData from "../../../../data_test.json";

interface QuarterlyData {
  quarter: string;
  totalOrders: number;
  uniqueCustomers: Set<string>;
  turnover: number;
}

const SupplierQuarterlyMetrics = ({ supplierId }: { supplierId: string }) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [quartersData, setQuartersData] = useState<QuarterlyData[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    // Get all products for this supplier
    const supplierProducts = orderData.products.filter(
      (p) => p.product.supplier?.manufacturer_id === supplierId,
    );

    // Filter valid confirmed orders containing supplier's products
    const orders = orderData.orders.filter(
      ({ order }) =>
        order.state === "delivered" &&
        order.status === "valid" &&
        order.items.some(
          (item) =>
            "supplier" in item && item.supplier?.manufacturer_id === supplierId,
        ),
    );

    // Extract unique years from orders
    const years = Array.from(
      new Set(
        orders.map(({ order }) =>
          new Date(order.createdAt * 1000).getFullYear(),
        ),
      ),
    ).sort((a, b) => b - a);

    setAvailableYears(years);
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }

    // Data processing
    const quarterlyMap = new Map<string, QuarterlyData>();
    const productSalesMap = new Map<string, Map<string, number>>(); // productId -> quarter -> soldQty

    // Initialize sales tracking structure
    supplierProducts.forEach((product) => {
      productSalesMap.set(product.product.productId, new Map<string, number>());
    });

    // First pass: Aggregate sales per product per quarter
    orders.forEach(({ order }) => {
      const orderDate = new Date(order.createdAt * 1000);
      const year = orderDate.getFullYear();
      const quarter = `Q${Math.floor(orderDate.getMonth() / 3) + 1}`;

      if (year !== selectedYear) return;

      // Initialize quarter data if not exists
      const quarterKey = `${quarter} ${selectedYear}`;
      if (!quarterlyMap.has(quarterKey)) {
        quarterlyMap.set(quarterKey, {
          quarter,
          totalOrders: 0,
          uniqueCustomers: new Set(),
          turnover: 0,
        });
      }

      const quarterData = quarterlyMap.get(quarterKey)!;
      quarterData.totalOrders++;
      quarterData.uniqueCustomers.add(order.customerId);

      // Process items
      order.items.forEach((item) => {
        if (
          "supplier" in item &&
          item.supplier?.manufacturer_id === supplierId
        ) {
          const productSales = productSalesMap.get(item.productId);
          if (productSales) {
            const currentQty = productSales.get(quarter) || 0;
            productSales.set(quarter, currentQty + parseFloat(item.quantity));
          }
        }
      });
    });

    // Second pass: Calculate turnover for each quarter
    quarterlyMap.forEach((quarterData, quarterKey) => {
      let turnover = 0;

      supplierProducts.forEach((product) => {
        const productId = product.product.productId;
        const costPrice = parseFloat(product.product.costPrice);
        const currentQty = parseFloat(product.product.qty);
        const soldInQuarter =
          productSalesMap.get(productId)?.get(quarterData.quarter) || 0;

        turnover += (currentQty + soldInQuarter) * costPrice;
      });

      quarterData.turnover = turnover;
    });

    setQuartersData(Array.from(quarterlyMap.values()));
  }, [supplierId, selectedYear]);

  return (
    <div className="border-stroke rounded-lg border bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Quarterly Performance</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded border p-2"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Quarter</th>
            <th className="p-3 text-left">Total Orders</th>
            <th className="p-3 text-left">Unique Customers</th>
            <th className="p-3 text-left">Turnover</th>
          </tr>
        </thead>
        <tbody>
          {quartersData.map((data, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-3">{data.quarter}</td>
              <td className="p-3">{data.totalOrders}</td>
              <td className="p-3">{data.uniqueCustomers.size}</td>
              <td className="p-3">{(data.turnover || 0).toFixed(2)} TND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierQuarterlyMetrics;
