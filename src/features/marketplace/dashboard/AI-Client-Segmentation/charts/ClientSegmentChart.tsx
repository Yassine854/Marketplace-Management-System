// src/features/marketplace/dashboard/charts/ClientSegmentDistributionChart.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ClientSegmentDistributionChart({
  cluster_distribution,
}: {
  cluster_distribution: Record<string, number>;
}) {
  const labels = Object.keys(cluster_distribution).map((k) => `Segment ${k}`);
  const series = Object.values(cluster_distribution);

  const options = {
    labels,
    legend: { position: "bottom" as "bottom" },
    colors: ["#36A2EB", "#FF6384", "#FFCE56", "#2ecc71"],
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <h4 className="mb-2 text-lg font-semibold text-gray-700">
        Cluster Distribution
      </h4>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={300}
      />
    </div>
  );
}
