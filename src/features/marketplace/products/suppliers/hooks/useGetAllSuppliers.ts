import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";

export interface Manufacturer {
  id: string;
  manufacturerId: number;
  code: string;
  companyName: string;
  contactName?: string;
  phoneNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  capital?: string;
  email?: string;
  address?: string;
  categories?: string[];
}

export const useGetAllSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.servicesClient.get(
        `/api/marketplace/supplier/getAll`,
      );
      setSuppliers(data.manufacturers || []);
      setTotal(data.totalManufacturers || 0);
    } catch (err) {
      let errorMessage = "Failed to fetch suppliers";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  return {
    suppliers,
    isLoading,
    error,
    refetch: fetchSuppliers,
    page,
    setPage,
    limit,
    setLimit,
    total,
    search,
    setSearch,
    isEmpty: !isLoading && !error && suppliers.length === 0,
  };
};
