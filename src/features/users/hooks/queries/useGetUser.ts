import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useUsersStore } from "../../stores/usersStore";

export const useGetUser = () => {
  const { userOnReviewUsername: username } = useUsersStore();
  const {
    isLoading,
    data: user,
    refetch,
  } = useQuery({
    queryKey: ["getUser", username],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/users/getUser?username=${username}`,
      );
      console.log("🚀 ~ queryFn: ~ data:", data);
      return data;
    },
  });

  return {
    user,
    refetch,
    isLoading,
  };
};
