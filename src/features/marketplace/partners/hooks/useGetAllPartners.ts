import useSWR from "swr";
import { axios } from "@/libs/axios";
import { Partner } from "@/types/partner";

const fetchPartners = async () => {
  const { data } = await axios.servicesClient.get<{
    partners: Partner[];
  }>("/api/marketplace/partners/getAll");
  return data.partners || [];
};

export const useGetAllPartners = () => {
  const {
    data: partners = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Partner[]>("partners", fetchPartners, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    partners,
    isLoading,
    error: error ? error.message : null,
    refetch: () => mutate(),
    isEmpty: !isLoading && !error && partners.length === 0,
  };
};
