// src/features/marketplace/dashboard/charts/ClientSegmentFeatureChart.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Segment } from "../hooks/useClientSegments";

export default function ClientSegmentFeatureChart({
  segments,
}: {
  segments: Segment[];
}) {
  const segmentNames = Array.from(new Set(segments.map((s) => s.segment_name)));
  const features = [
    "total_orders",
    "total_spent",
    "avg_order_value",
    "recency_days",
  ];

  // Average feature values per segment
  const series = features.map((feature) => ({
    name: feature.replace(/_/g, " "),
    data: segmentNames.map((name) => {
      const segs = segments.filter((s) => s.segment_name === name);
      return (
        segs.reduce((sum, s) => sum + (s as any)[feature], 0) / segs.length
      );
    }),
  }));

  const options = {
    chart: { type: "bar" as "bar", stacked: false },
    xaxis: { categories: segmentNames },
    legend: { position: "bottom" as "bottom" },
    colors: ["#36A2EB", "#FF6384", "#FFCE56", "#2ecc71"],
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <h4 className="mb-2 text-lg font-semibold text-gray-700">
        Feature Comparison by Segment
      </h4>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}
