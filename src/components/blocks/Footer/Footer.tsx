import Link from "next/link";

const Footer = () => {
  return (
    <div className=" p2  flex  h-12 items-center justify-center   ">
      <p className="max text-sm max-md:text-center lg:text-base">
        Copyright ©{new Date().getFullYear()}{" "}
        <Link className="text-primary" href="/">
          Kamioun
        </Link>
      </p>
      <div
        className={
          "m-h m-w-[80%] flex h-16 flex-col items-center justify-center gap-4  dark:bg-bg4  "
        }
      ></div>
    </div>
  );
};

export default Footer;
