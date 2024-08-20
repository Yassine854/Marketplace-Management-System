import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

const auditTrailFake = [
  {
    id: "1",
    username: "admin",
    orderId: "12342134",
    storeId: "1",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "2124",
    username: "admin",
    orderId: "12342134",
    storeId: "2",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "2",
    username: "admin",
    orderId: "12342134",
    storeId: "2",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "224",
    username: "admin",
    orderId: "12342134",
    storeId: "3",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "3",
    username: "admin",
    orderId: "12342134",
    storeId: "",
    time: "2024-12-02",
    action: "cancel",
  },
  {
    id: "4",
    username: "admin",
    orderId: "12342134",
    storeId: "3",
    time: "2024-12-02",
    action: "cancel",
  },
];

export const useGetOrdersAuditTrail = () => {
  const {
    isLoading,
    data: auditTrail,
    refetch,
  } = useQuery({
    queryKey: ["ordersAuditTrail"],
    queryFn: () => {
      // const { data } = await axios.servicesClient(
      //   `/api/users/getUser?username=${username}`,
      // );
      // return data;
    },
  });

  return {
    auditTrail: auditTrailFake,
    refetch,
    isLoading,
  };
};
