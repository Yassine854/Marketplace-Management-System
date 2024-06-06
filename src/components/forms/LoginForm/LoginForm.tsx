import Loading from "@/components/elements/Loading";
import PasswordInput from "@/components/inputs/PasswordInput";
import TextInput from "@/components/inputs/TextInput";
import { useLoginForm } from "@/hooks/formsHooks/useLoginForm";

const LoginForm = () => {
  const { handleSubmit, register, errors, isLoading } = useLoginForm();

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
