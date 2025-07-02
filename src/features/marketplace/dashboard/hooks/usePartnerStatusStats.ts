import { useEffect, useState } from "react";
import axios from "axios";

export interface UsePartnerStatusStatsResult {
  active: number;
  inactive: number;
  isLoading: boolean;
  isError: boolean;
}

export function usePartnerStatusStats(): UsePartnerStatusStatsResult {
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("/api/marketplace/partners/getAll")
      .then((res) => {
        const partners = res.data.partners || [];
        setActive(
          partners.filter((p: { isActive: boolean }) => p.isActive).length,
        );
        setInactive(
          partners.filter((p: { isActive: boolean }) => !p.isActive).length,
        );
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return {
    active,
    inactive,
    isLoading,
    isError,
  };
}
