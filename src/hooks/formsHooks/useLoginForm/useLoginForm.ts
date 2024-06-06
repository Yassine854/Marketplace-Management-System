import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

import { FormSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof FormSchema>;

export const useLoginForm = () => {
  const { navigateToDashboard } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    const { username, password } = data;
    const res = await login(username, password);
    setIsLoading(false);
    if (res?.error === "CredentialsSignin") {
      toast.error("Invalid username or password");
    } else {
      toast.success("Welcome To Kamioun OMS !", { duration: 3000 });
      navigateToDashboard();
    }
  };

  return { handleSubmit: handleSubmit(onSubmit), register, errors, isLoading };
};
