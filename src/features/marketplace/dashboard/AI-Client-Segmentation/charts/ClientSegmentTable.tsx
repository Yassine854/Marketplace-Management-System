// src/features/marketplace/dashboard/charts/ClientSegmentTable.tsx
import React from "react";
import { Segment } from "../hooks/useClientSegments";

export default function ClientSegmentTable({
  segments,
}: {
  segments: Segment[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
      <h4 className="mb-2 text-lg font-semibold text-gray-700">
        Segment Details
      </h4>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Segment</th>
            <th>Total Orders</th>
            <th>Total Spent</th>
            <th>Avg Order Value</th>
            <th>Recency (days)</th>
            <th>Governorate</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((s) => (
            <tr key={s.customer_id}>
              <td>{s.customer_id}</td>
              <td>{s.segment_name}</td>
              <td>{s.total_orders}</td>
              <td>{s.total_spent}</td>
              <td>{s.avg_order_value.toFixed(2)}</td>
              <td>{s.recency_days}</td>
              <td>{s.governorate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
