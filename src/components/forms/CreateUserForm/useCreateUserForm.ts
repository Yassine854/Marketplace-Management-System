import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import { FormSchema } from "./formSchema";
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
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const warehouseRef = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("🚀 ~ const onSubmit:SubmitHandler<FormData>= ~ data:", data);
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
    handleSubmit,
    register,
    setValue,
    errors,
    setSelectedRole,
    warehouseRef,
    roles,
    warehouses,
  };
};
