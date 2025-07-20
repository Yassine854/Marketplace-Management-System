import Loading from "@/features/shared/elements/Loading";
import PasswordInput from "@/features/shared/inputs/PasswordInput";
import TextInput from "@/features/shared/inputs/TextInput";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { useFeatureValue } from "@growthbook/growthbook-react";
import { usePathname, useRouter } from "@/libs/next-intl/i18nNavigation";

const LoginForm = () => {
  const { handleSubmit, register, errors, isLoading } = useLoginForm();
  const { push } = useRouter();

  // const btn_gb=useFeatureValue("btn-ok",true);
  // if (btn_gb) {
  //   return null;
  // }
  return (
    <form onSubmit={handleSubmit}>
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

      <div className="mt-8 flex flex-col items-center justify-center gap-4 p-8">
        {isLoading && <Loading />}

        {!isLoading && (
          <>
            <button
              type="submit"
              className="btn h-12 w-64 items-center justify-center px-5"
            >
              {isLoading ? <Loading /> : "Login"}
            </button>
            <button
              type="button"
              onClick={() => push("/signUp")}
              className="btn mt-2 h-12 w-64 items-center justify-center rounded bg-secondary px-5 text-white shadow transition hover:bg-secondary/90"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
