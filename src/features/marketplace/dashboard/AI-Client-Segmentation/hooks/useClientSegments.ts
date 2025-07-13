// src/features/marketplace/dashboard/hooks/useClientSegments.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface Segment {
  customer_id: string;
  segment_name: string;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  recency_days: number;
  governorate: string;
}

export interface ClientSegmentsData {
  model_type: string;
  optimal_clusters: number;
  features_used: string[];
  total_customers_segmented: number;
  cluster_distribution: Record<string, number>;
  segments: Segment[];
  silhouette_score: number;
}

export function useClientSegments() {
  const [data, setData] = useState<ClientSegmentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("https://pfe-client-segmentation.onrender.com/segments")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, isError };
}
