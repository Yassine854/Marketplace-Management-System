"use client";

import { IconArrowLeft, IconEye, IconEyeOff } from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginThreeContent = () => {
  const [showPass, setShowPass] = useState(false);
  const { push } = useRouter();

  return (
    <div className=" flex flex min-h-screen flex-grow items-center justify-center bg-[url(/images/login-bg.png)] bg-cover px-3 py-10 md:px-5 md:py-16 lg:py-20 xl:py-28">
      <div className="box w-full max-w-[805px] items-center p-3 md:p-4 xl:p-6">
        <form className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8">
          {/* <Link
            href="/dashboards/personal-1"
            className="flex items-center gap-2">
            <IconArrowLeft size={20} /> Back To Home
          </Link> */}
          <div className="flex flex-grow items-center justify-center ">
            <Image
              src={"/images/kamioun-logo.png"}
              alt="logo"
              width={320}
              height={280}
            />
          </div>

          {/* <h3 className="h3 my-4">Welcome Back!</h3> */}
          <p className="bb-dashed mb-4 pb-4 text-sm md:mb-6 md:pb-6 md:text-base"></p>
          <label htmlFor="email" className="mb-4 block font-medium md:text-lg">
            Enter Your Email
          </label>
          <input
            type="email"
            className="mb-5 w-full rounded-3xl border border-n30 bg-n0 px-3 py-2 text-sm focus:outline-none dark:border-n500 dark:bg-bg4 md:px-6 md:py-3"
            placeholder="Enter Your Email"
            id="email"
            required
          />
          <label
            htmlFor="password"
            className="mb-4 block font-medium md:text-lg"
          >
            Enter Your Password
          </label>
          <div className=" relative mb-4 rounded-3xl border border-n30 bg-n0 px-3 py-2 dark:border-n500 dark:bg-bg4 md:px-6 md:py-3">
            <input
              type={showPass ? "text" : "password"}
              className="w-11/12 bg-transparent text-sm focus:outline-none"
              placeholder="Enter Your Password"
              id="password"
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 -translate-y-1/2 cursor-pointer ltr:right-5 rtl:left-5"
            >
              {showPass ? <IconEye /> : <IconEyeOff />}
            </span>
          </div>

          <p className="mt-3"></p>
          <div className="mt-8 flex items-center justify-center gap-6	 p-8">
            <button
              className="btn w-64 items-center justify-center px-5 "
              onClick={() => {
                push("/dashboard");
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginThreeContent;
