import React from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaUsers,
  FaBox,
  FaDollarSign,
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
  FaPercent,
} from "react-icons/fa";
import supplierData from "../../../../data_test.json";
import SupplierAreaChart from "../charts/SupplierAreaChart";
import TopArticlesOrdered from "../charts/TopArticlesOrdered";
import ProductRevenueLossChart from "../charts/ProductRevenueLossChart";

// Test on 1 Supplier (Technofood - ID: 9)
const supplierId = "10";

const supplierStats = supplierData.reduce(
  (acc, order) => {
    const supplier = order.suppliers.find(
      (s) => s.manufacturer_id === supplierId,
    );

    if (supplier) {
      acc.totalOrders += 1;

      // Track total revenue after discounts
      let revenueAfterDiscounts = supplier.totals.grand_total;

      // Count products with discounts and adjust revenue
      let productsWithDiscounts = 0;
      supplier.items.forEach((item) => {
        // Check if the item has a discount and the discount amount is greater than 0
        if (item.discount && item.discount.discount_amount > 0) {
          productsWithDiscounts += 1;
          revenueAfterDiscounts -= item.discount.discount_amount; // Adjust revenue based on the discount
        }
      });

      // Update revenue with the adjusted value (including any discounts)
      acc.totalRevenue += revenueAfterDiscounts;

      // Track the number of products with discounts
      acc.productsWithDiscounts += productsWithDiscounts;

      acc.pendingReturns += supplier.returns.length;

      // Check if the order has been successfully delivered
      if (order.supplier_orders_summary.combined.order_status === "delivered") {
        acc.deliveredOrders += 1;
      }

      acc.pendingInvoices += supplier.invoices.filter(
        (invoice) => invoice.payment_status === "Pending",
      ).length;

      acc.paidInvoices += supplier.invoices
        .filter((invoice) => invoice.payment_status === "Paid")
        .reduce((sum, invoice) => sum + invoice.amount, 0);

      acc.totalTax += supplier.totals.tax;
    }

    return acc;
  },
  {
    totalOrders: 0,
    totalRevenue: 0,
    pendingReturns: 0,
    deliveredOrders: 0,
    productsWithDiscounts: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    totalTax: 0,
  },
);

const SupplierDashboard = () => {
  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardDataStats
          title="Total Orders"
          total={supplierStats.totalOrders.toString()}
          rate=""
        >
          <FaClipboardList className="text-blue-500" />
        </CardDataStats>

        <CardDataStats
          title="Total Revenue"
          total={`${supplierStats.totalRevenue.toFixed(2)} TND`}
          rate=""
        >
          <FaMoneyBillWave className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Average Order Value"
          total={`${(
            supplierStats.totalRevenue / supplierStats.totalOrders
          ).toFixed(2)} TND`}
          rate=""
        >
          <FaDollarSign className="text-yellow-500" />
        </CardDataStats>

        {/* ✅ New Card for Delivered Orders */}
        <CardDataStats
          title="Delivered Orders"
          total={supplierStats.deliveredOrders.toString()}
          rate=""
        >
          <FaCheckCircle className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Pending Returns"
          total={supplierStats.pendingReturns.toString()}
          rate=""
        >
          <FaBox className="text-red-500" />
        </CardDataStats>

        {/* ✅ New Card for Products with Discounts */}
        <CardDataStats
          title="Products with Discounts"
          total={supplierStats.productsWithDiscounts.toString()}
          rate=""
        >
          <FaPercent className="text-purple-500" />
        </CardDataStats>

        <CardDataStats
          title="Pending Invoices"
          total={supplierStats.pendingInvoices.toString()}
          rate=""
        >
          <FaClipboardList className="text-orange-500" />
        </CardDataStats>

        <CardDataStats
          title="Paid Invoices"
          total={`${supplierStats.paidInvoices.toFixed(2)} TND`} // Display paid invoice amount in TND
          rate=""
        >
          <FaCheckCircle className="text-blue-500" />
        </CardDataStats>

        {/* New Card for Total Taxes */}
        <CardDataStats
          title="Total Taxes"
          total={`${supplierStats.totalTax.toFixed(2)} TND`}
          rate=""
        >
          <FaDollarSign className="text-red-500" />
        </CardDataStats>

        {/* Supplier Revenue Chart */}
        <div className="mt-6">
          <SupplierAreaChart supplierId={supplierId} />
        </div>

        {/* Supplier Pie Chart */}
        <div className="mt-6">
          <TopArticlesOrdered supplierId={supplierId} />
        </div>

        {/* Supplier Bar Chart */}
        <div className="mt-6">
          <ProductRevenueLossChart supplierId={supplierId} />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
