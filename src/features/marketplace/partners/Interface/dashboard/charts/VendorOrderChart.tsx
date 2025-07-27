"use client";

import { useEffect, useState } from "react";

const VendorOrdersChart = () => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const baseUrl = "https://charts.mongodb.com/charts-project-0-ionjeod";
    const chartId = "7c0b1211-d016-4734-b6f6-87bf91a6135a";

    const filter = {
      partnerId: { $oid: "67da9e710ef51580963df9b9" },
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));

    const chartUrl = `${baseUrl}/embed/charts?id=${chartId}&theme=light&autoRefresh=true&filter=${encodedFilter}`;

    setSrc(chartUrl);
  }, []);

  if (!src) return null;

  return (
    <iframe
      className="h-[400px] w-full rounded-md shadow-md"
      style={{ border: "none" }}
      src={src}
      allowFullScreen
    />
  );
};

export default VendorOrdersChart;
