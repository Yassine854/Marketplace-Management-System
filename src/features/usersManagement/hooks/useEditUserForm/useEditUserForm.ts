import * as z from "zod";
import { toast } from "react-hot-toast";
import { editUserFormSchema } from "./editUserformSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useUser } from "@/features/usersManagement/hooks/useUser";
import { useEffect } from "react";
import { useGetUser } from "../queries/useGetUser";
import { useEditUser } from "../mutations/useEditUser";
import { useUsersStore } from "../../stores/usersStore";
import { useGetUsers } from "../queries/useGetUsers";

type FormData = z.infer<typeof editUserFormSchema>;

export const useEditUserForm = () => {
  const { userOnReviewUsername } = useUsersStore();
  const userClient = useUser();
  const { user, refetch } = useGetUser();
  const { refetch: refetchAll } = useGetUsers();

  const { navigateToUsersTable } = useNavigation();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editUserFormSchema),
  });

  const { edit } = useEditUser();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const {
      success,
      //   data: a,
      message,
    } = await edit({ username: userOnReviewUsername, ...data });
    if (success) {
      refetch();
      refetchAll();
      toast.success(message, {
        duration: 2000,
      });
      navigateToUsersTable();
    } else {
      toast.error(message, { duration: 2000 });
    }
  };

  useEffect(() => {
    if (user) {
      setValue("firstName", user?.firstName);
      setValue("lastName", user?.lastName);
      setValue("roleId", user?.roleId);
    }
  }, [user]);

  return {
    errors,
    onSubmit,
    register,
    setValue,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: userClient.mutation.create.isLoading,
    user: userClient.queries.getUser,
  };
};
