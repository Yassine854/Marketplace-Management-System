import React, { useState, useEffect } from "react";
import CardDataStats from "../charts/CardDataStats";
import {
  FaUsers,
  FaBox,
  FaDollarSign,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";
import supplierData from "../../../../data_test.json";
import SupplierAreaChart from "../charts/SupplierAreaChart";

// Test on 1 Supplier (Technofood - ID: 9)

const supplierId = "9";

const supplierStats = supplierData.reduce(
  (acc, order) => {
    const supplier = order.suppliers.find(
      (s) => s.manufacturer_id === supplierId,
    );
    if (supplier) {
      acc.totalOrders += 1;
      acc.totalRevenue += supplier.totals.grand_total;
      acc.pendingReturns += supplier.returns.length;
    }
    return acc;
  },
  { totalOrders: 0, totalRevenue: 0, pendingReturns: 0 },
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
          total={`$${supplierStats.totalRevenue.toFixed(2)}`}
          rate=""
        >
          <FaMoneyBillWave className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Pending Returns"
          total={supplierStats.pendingReturns.toString()}
          rate=""
        >
          <FaBox className="text-red-500" />
        </CardDataStats>

        <div className="mt-6">
          <SupplierAreaChart supplierId={supplierId} />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
