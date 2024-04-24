import Link from "next/link";

const Footer = () => {
  return (
    <div className=" flex  h-8  items-center justify-center bg-n0 p-2   ">
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
