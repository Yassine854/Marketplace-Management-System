"use client";

import { IconChevronDown, IconWorld } from "@tabler/icons-react";
import { usePathname, useRouter } from "@/libs/i18nNavigation";

import { AllLocales } from "@/utils/AppConfig";
import ISO6391 from "iso-639-1";
import useDropdown from "@/utils/useDropdown";
import { useLocale } from "next-intl";
import { useState } from "react";

const LanguageSwitcher = ({ isWhite }: { isWhite?: boolean }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();
  const [selected, setSelected] = useState(locale);
  const { open, ref, toggleOpen } = useDropdown();

  const onSelect = (lang: string) => {
    if (lang != locale) router.push(pathName, { locale: lang });
  };
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className={`flex gap-1 p-2 sm:p-3 rounded-full ${
          isWhite
            ? "bg-n0 dark:bg-bg4 border border-n30 dark:border-n500"
            : "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <IconWorld />
        <IconChevronDown size={22} />
      </button>
      <div
        className={`bg-n0 border dark:border-n500 ltr:origin-top-right rtl:origin-top-left dark:bg-n800 rounded-md ltr:right-0 rtl:left-0 shadow-lg absolute top-full duration-300 ${
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-0 invisible"
        }`}
      >
        <ul className="flex flex-col w-32 bg-n0 p-1 rounded-md dark:bg-bg4">
          {AllLocales.map((locale) => (
            <li
              key={locale}
              onClick={() => onSelect(locale)}
              className={`px-4 block py-2 rounded-md cursor-pointer duration-300 hover:text-primary ${
                selected == locale && "bg-primary text-n0 hover:!text-n0"
              }`}
            >
              {ISO6391.getNativeName(locale)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
