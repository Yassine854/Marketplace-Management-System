import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGetAllUsers } from "../queries/useGetAllUsers";

export const useEditUser = () => {
  const { navigateToUsersTable } = useNavigation();
  const { refetch: refetchAll } = useGetAllUsers();

  const { mutate, isPending } = useMutation({
    mutationFn: async (user: any) => {
      await axios.servicesClient.put("/api/users/editUser", user);
    },
    onSuccess: () => {
      refetchAll();
      toast.success(`User Edited Successfully`, { duration: 5000 });

      navigateToUsersTable();
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    isPending,
    editUser: mutate,
  };
};
