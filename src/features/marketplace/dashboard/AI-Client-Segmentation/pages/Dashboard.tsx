// src/features/marketplace/dashboard/pages/client-segments.tsx
import { useClientSegments } from "../hooks/useClientSegments";
import ClientSegmentDistributionChart from "../charts/ClientSegmentChart";
import ClientSegmentFeatureChart from "../charts/ClientSegmentFeatureChart";
import ClientSegmentTable from "../charts/ClientSegmentTable";

export default function Dashboard() {
  const { data, isLoading, isError } = useClientSegments();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading client segments.</div>;

  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold">Client Segmentation</h2>
      <ClientSegmentDistributionChart
        cluster_distribution={data.cluster_distribution}
      />
      <ClientSegmentFeatureChart segments={data.segments} />
      <ClientSegmentTable segments={data.segments} />
    </div>
  );
}
