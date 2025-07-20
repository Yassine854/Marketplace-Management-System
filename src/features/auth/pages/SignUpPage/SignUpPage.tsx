import Image from "next/image";
import SignUpForm from "../../forms/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen flex-grow items-center justify-center bg-[url(/images/login-bg.png)] bg-cover px-3 py-10 md:px-5 md:py-16 lg:py-20 xl:py-28">
      <div className="box flex w-full max-w-5xl flex-col items-center gap-8 p-4 md:flex-row">
        {/* Branding/Logo section */}
        <div className="mb-8 flex flex-1 flex-col items-center justify-center md:mb-0">
          <Image
            src={"/images/kamioun-logo.png"}
            alt="Kamioun Logo"
            width={260}
            height={280}
            className="mb-4"
          />
          <h2 className="mb-2 text-2xl font-bold text-primary">
            Partner Signup
          </h2>
          <p className="max-w-xs text-center text-base text-gray-600">
            Join Kamioun as a partner Today.
          </p>
        </div>
        {/* Signup Form section */}
        <div className="w-full flex-1">
          <div className="box rounded-lg bg-primary/5 p-6 shadow-lg dark:bg-bg3 xl:p-8">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
