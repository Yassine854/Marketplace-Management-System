// import * as z from "zod";

// import { IconEye, IconEyeOff } from "@tabler/icons-react";
// import { SubmitHandler, useForm } from "react-hook-form";

// import { toast } from "react-hot-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { useNavigation } from "@/hooks/useNavigation";
// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";

// const FormSchema = z.object({
//   username: z.string().min(6, {
//     message: "Username must be at least 6 characters.",
//   }),
//   password: z.string().min(6, {
//     message: "Password must be at least 6 characters.",
//   }),
// });

// type FormData = z.infer<typeof FormSchema>;

// const LoginForm = () => {
//   const { navigateToDashboard } = useNavigation();
//   const [showPass, setShowPass] = useState(false);
//   const { login } = useAuth();

//   const { handleSubmit, register } = useForm({
//     resolver: zodResolver(FormSchema),

//     defaultValues: {
//       username: "",
//       password: "",
//     },
//   });

//   const onSubmit: SubmitHandler<any> = async (data: FormData) => {
//     try {
//       const { username, password } = data;

//       const res = await login(username, password);

//       res?.error ? toast.error("Error") : navigateToDashboard();
//     } catch (error: any) {
//       console.error(error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <label htmlFor="username" className="mb-4 block font-medium md:text-lg">
//         Enter Your Username
//       </label>
//       <input
//         {...register("username")}
//         className="mb-5 w-full rounded-3xl border border-n30 bg-n0 px-3 py-2 text-sm focus:outline-none dark:border-n500 dark:bg-bg4 md:px-6 md:py-3"
//       />
//       <label htmlFor="password" className="mb-4 block font-medium md:text-lg">
//         Enter Your Password
//       </label>
//       <div className=" relative mb-4 rounded-3xl border border-n30 bg-n0 px-3 py-2 dark:border-n500 dark:bg-bg4 md:px-6 md:py-3">
//         <input
//           type={showPass ? "text" : "password"}
//           className="w-11/12 bg-transparent text-sm focus:outline-none"
//           {...register("password")}
//         />
//         <span
//           onClick={() => setShowPass(!showPass)}
//           className="absolute top-1/2 -translate-y-1/2 cursor-pointer ltr:right-5 rtl:left-5"
//         >
//           {showPass ? <IconEye /> : <IconEyeOff />}
//         </span>
//       </div>

//       <p className="mt-3"></p>
//       <div className="mt-8 flex items-center justify-center gap-6	 p-8">
//         <button className="btn w-64 items-center justify-center px-5 ">
//           <input className="hidden" type="submit" />
//           Login
//         </button>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;

import * as z from "zod";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

const LoginForm = () => {
  const { navigateToDashboard } = useNavigation();
  const [showPass, setShowPass] = useState(false);
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
    try {
      const { username, password } = data;
      const res = await login(username, password);
      if (res?.error) {
        toast.error("Error: " + res.error);
      } else {
        toast.success("Login successful!");
        navigateToDashboard();
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="username" className="ml-4 block font-medium md:text-lg">
          Username
        </label>
        <input
          {...register("username")}
          id="username"
          className="w-full rounded-3xl border border-n30 bg-n0 px-3 py-2 text-sm focus:outline-none dark:border-n500 dark:bg-bg4 md:px-6 md:py-3"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="ml-4 block font-medium md:text-lg">
          Password
        </label>
        <div className="relative rounded-3xl border border-n30 bg-n0 px-3 py-2 dark:border-n500 dark:bg-bg4 md:px-6 md:py-3">
          <input
            type={showPass ? "text" : "password"}
            id="password"
            className="w-11/12 bg-transparent text-sm focus:outline-none"
            {...register("password")}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute top-1/2 -translate-y-1/2 cursor-pointer ltr:right-5 rtl:left-5"
          >
            {showPass ? <IconEye /> : <IconEyeOff />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 p-8">
        <button
          type="submit"
          className="btn w-64 items-center justify-center px-5"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
