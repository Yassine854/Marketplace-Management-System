import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

import { FormSchema } from "./formSchema";
import Loading from "@/components/elements/Loading";
import PasswordInput from "@/components/inputs/PasswordInput";
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
      <div className="mb-4">
        <label htmlFor="username" className="ml-4 block font-medium md:text-lg">
          Username
        </label>
        <input
          placeholder="Username"
          {...register("username")}
          id="username"
          className="w-full rounded-3xl border border-n30 bg-n0 px-3 py-2 text-sm focus:outline-none dark:border-n500 dark:bg-bg4 md:px-6 md:py-3"
        />
        {errors.username && (
          <p className="pl-2 pt-1 text-red-500">{errors.username.message}</p>
        )}
      </div>
      <PasswordInput
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
