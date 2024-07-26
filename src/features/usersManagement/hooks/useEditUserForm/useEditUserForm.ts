import * as z from "zod";
import { toast } from "react-hot-toast";
import { FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useUser } from "@/features/usersManagement/hooks/mutations/useUser";

type FormData = z.infer<typeof FormSchema>;

export const useEditUserForm = () => {
  const user = useUser();

  const { navigateToUsersTable } = useNavigation();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { firstName, lastName, roleId, password } = data;
    console.log("🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ data:", data);

    // const { message, success } = await user.mutation.create.newUser({
    //   roleId,
    //   lastName,
    //   password,
    //   firstName,
    // });

    // if (success) {
    //   toast.success(message, {
    //     duration: 2000,
    //   });
    //   navigateToUsersTable();
    // } else {
    //   toast.error(message, { duration: 2000 });
    // }
  };

  return {
    errors,
    onSubmit,
    register,
    setValue,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: user.mutation.create.isLoading,
  };
};
