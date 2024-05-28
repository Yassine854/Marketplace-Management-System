import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

import { FormSchema } from "./formSchema";
import Loading from "@/components/elements/Loading";
import PasswordInput from "@/components/inputs/PasswordInput";
import TextInput from "@/components/inputs/TextInput";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof FormSchema>;

const LoginForm = () => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Username"
        placeholder="Enter your username"
        register={register("username")}
        isError={errors.username}
        errorMessage={errors.username?.message}
      />

      <PasswordInput
        placeholder="Enter your password"
        register={register("password")}
        label="Password"
        isError={errors.password}
        errorMessage={errors.password?.message}
      />

      <div className="mt-8 flex items-center justify-center gap-6 p-8">
        {isLoading && <Loading />}

        {!isLoading && (
          <button
            type="submit"
            className="btn h-12 w-64 items-center justify-center px-5"
          >
            {isLoading ? <Loading /> : "Login"}
          </button>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
