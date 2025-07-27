import Loading from "@/features/shared/elements/Loading";
import PasswordInput from "@/features/shared/inputs/PasswordInput";
import TextInput from "@/features/shared/inputs/TextInput";
import { useSignUpForm } from "@/features/auth/hooks/useSignUpForm/useSignUp";
import React from "react";

const SignUpForm = () => {
  const { handleSubmit, register, errors, isLoading } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          label="Username"
          placeholder="Enter your username"
          register={register("username")}
          isError={!!errors.username}
          errorMessage={errors.username?.message}
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          register={register("email")}
          isError={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <TextInput
          label="Phone"
          placeholder="Enter your phone"
          register={register("telephone")}
          isError={!!errors.telephone}
          errorMessage={errors.telephone?.message}
        />
        <TextInput
          label="Address"
          placeholder="Enter your address"
          register={register("address")}
          isError={!!errors.address}
          errorMessage={errors.address?.message}
        />
        <TextInput
          label="Coverage Area"
          placeholder="Enter the coverage area"
          register={register("coverageArea")}
          isError={!!errors.coverageArea}
          errorMessage={errors.coverageArea?.message}
        />
        <TextInput
          label="Minimum Amount"
          placeholder="Enter the minimum amount"
          register={register("minimumAmount")}
          isError={!!errors.minimumAmount}
          errorMessage={errors.minimumAmount?.message}
          type="number"
        />
      </div>
      <PasswordInput
        placeholder="Enter your password"
        register={register("password")}
        label="Password"
        isError={!!errors.password}
        errorMessage={errors.password?.message}
      />
      <div className="mt-8 flex flex-col items-center justify-center gap-6 p-8">
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <button
              type="submit"
              className="btn h-12 w-64 items-center justify-center rounded bg-primary px-5 text-white shadow transition hover:bg-primary/90"
            >
              Sign Up
            </button>
            <div className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.assign("/login")}
                className="text-blue-600 underline hover:text-blue-800 focus:outline-none"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                Log in here
              </button>
              .
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
