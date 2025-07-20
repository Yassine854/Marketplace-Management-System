import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

type FormData = z.infer<typeof FormSchema>;

export const useSignUpForm = () => {
  const { navigateToPartnersDashboard } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      // minimumAmount should be sent as string/number
      formData.set("minimumAmount", data.minimumAmount.toString());

      const res = await fetch("/api/marketplace/signUp", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Auto-login the partner after successful signup
      const loginResult = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.error(
          "Signup successful but login failed. Please login manually.",
        );
        setIsLoading(false);
        return;
      }

      toast.success("Partner account created! Redirecting to dashboard...");
      reset();
      navigateToPartnersDashboard();
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    errors,
    isLoading,
    watch,
  };
};
