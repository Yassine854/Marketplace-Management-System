"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer  w-full h-16 mt-12 ">
      <div
        className={
          "flex flex-col justify-center items-center gap-4 h-16 bg-n0 dark:bg-bg4   "
        }
      >
        <p className="text-sm lg:text-base max-md:text-center max-md:w-full">
          Copyright ©{new Date().getFullYear()}{" "}
          <Link className="text-primary" href="/">
            Kamioun
          </Link>
        </p>

        <ul className="flex gap-3 lg:gap-4 text-sm lg:text-base max-lg:justify-center max-lg:w-full"></ul>
      </div>
    </footer>
  );
};

export default Footer;
