import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import { FormSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useUser } from "@/features/usersManagement/hooks/mutations/useUser";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof FormSchema>;

const roles = [
  { name: "Agent", key: "AGENT" },
  { name: "Ops", key: "OPS" },
  { name: "Admin", key: "ADMIN" },
];

const warehouses = [
  { name: "Mghira", key: "1001" },
  { name: "Shargia", key: "1002" },
  { name: "Mnihla", key: "1003" },
  { name: "Ariana", key: "1004" },
  { name: "sousse", key: "2001" },
  { name: "Mounastir", key: "3001" },
];

export const useCreateUserForm = () => {
  const { navigateToUsersTable } = useNavigation();
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const warehouseRef = useRef(null);
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
    const {
      username,
      email,
      firstName,
      lastName,
      roleCode,
      warehouseCode,
      password,
    } = data;

    const { message, success } = await user.mutation.create.newUser({
      username,
      email,
      firstName,
      lastName,
      roleCode,
      warehouseCode,
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
    //@ts-ignore
    const changeSelected = warehouseRef.current?.changeSelected;
    if (selectedRole?.key == "ADMIN") {
      changeSelected({ name: "All", key: "all" });
    } else {
      changeSelected(warehouses[0]);
    }
  }, [selectedRole]);

  return {
    onSubmit,
    handleSubmit: handleSubmit(onSubmit),
    register,
    setValue,
    errors,
    setSelectedRole,
    warehouseRef,
    roles,
    warehouses,
    isLoading: user.mutation.create.isLoading,
  };
};
