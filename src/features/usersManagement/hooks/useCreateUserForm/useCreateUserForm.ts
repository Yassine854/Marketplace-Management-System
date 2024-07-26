import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { FormSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useUser } from "@/features/usersManagement/hooks/mutations/useUser";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof FormSchema>;

const roles = [
  { name: "Admin", key: "1" },
  { name: "Agent-Tunis", key: "2" },
  { name: "Agent-Sousse", key: "3" },
];

export const useCreateUserForm = () => {
  const { navigateToUsersTable } = useNavigation();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]);

  const user = useUser();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { username, firstName, lastName, roleId, password } = data;

    const { message, success } = await user.mutation.create.newUser({
      username,
      firstName,
      lastName,
      roleId,
      password,
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

  useEffect(() => {
    console.log("🚀 ~ useCreateUserForm ~ selectedRoleId:", selectedRoleId);

    //@ts-ignore
    // const changeSelected = warehouseRef.current?.changeSelected;
    // if (selectedRole?.key == "ADMIN") {
    //   changeSelected({ name: "All", key: "all" });
    // } else {
    //   changeSelected(warehouses[0]);
    // }
  }, [selectedRoleId]);

  return {
    onSubmit,
    handleSubmit: handleSubmit(onSubmit),
    register,
    setValue,
    errors,
    setSelectedRoleId,
    roles,
    isLoading: user.mutation.create.isLoading,
  };
};
