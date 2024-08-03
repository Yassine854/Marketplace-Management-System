import * as z from "zod";
import { toast } from "react-hot-toast";
import { FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useUser } from "@/features/users/hooks/useUser";
import { useGetUser } from "../queries/useGetUser";
import { useEffect } from "react";

type FormData = z.infer<typeof FormSchema>;

export const useCreateUserForm = () => {
  const userClient = useUser();
  const { user } = useGetUser();
  const { navigateToUsersTable } = useNavigation();

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors, defaultValues },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { username, firstName, lastName, roleId, password } = data;

    const { message, success } = await userClient.mutation.create.newUser({
      roleId,
      username,
      lastName,
      password,
      firstName,
    });

    if (success) {
      toast.success(message, {
        duration: 2000,
      });
      navigateToUsersTable();
    } else {
      toast.error(message, { duration: 2000 });
    }
  };

  return {
    user,
    errors,
    onSubmit,
    register,
    setValue,
    getValues,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: userClient.mutation.create.isLoading,
  };
};
