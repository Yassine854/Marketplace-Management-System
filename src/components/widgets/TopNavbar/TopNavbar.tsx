import {
  IconMenu2,
  IconSearch,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import Notification from "@/components/elements/TopNavBarElements/Notification";
import Profile from "@/components/elements/TopNavBarElements/Profile";

import { useState } from "react";

import { useLayout } from "@/utils/LayoutContext";
import { useDropdown } from "@/hooks/useDropdown";
import { IconChevronDown, IconLayoutSidebar } from "@tabler/icons-react";
import { useOrdersStore } from "@/stores/ordersStore";

export const layoutList = ["All", "Tunis", "Sousse", "Kamarket"];

const SelectLayout = ({ isWhite }: { isWhite?: boolean }) => {
  const { open, ref, toggleOpen } = useDropdown();
  const { setStoreId } = useOrdersStore();
  // const { layout, changeLayout } = useLayout();

  const [layout, setLayout] = useState(layoutList[0]);

  useEffect(() => {
    switch (layout) {
      case "All":
        setStoreId("");
        break;
      case "Tunis":
        setStoreId("1");
        break;
      case "Sousse":
        setStoreId("2");
        break;

      case "Kamarket":
        setStoreId("4");
        break;
    }
  }, [layout, setStoreId]);

  return (
    <div
      ref={ref}
      className="relative hidden min-w-[250px] lg:block xxl:min-w-[272px]"
    >
      <div
        onClick={toggleOpen}
        className={` ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        } flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] px-4 py-3 xxl:px-6`}
      >
        <span className="flex select-none items-center gap-2">
          {/* <IconLayoutSidebar className="text-primary" /> */}
          <IconBuildingWarehouse className="text-primary" />
          {layout}
        </span>
        <IconChevronDown
          className={`shrink-0 ${open && "rotate-180"} duration-300`}
        />
      </div>
      <ul
        className={`absolute left-0 top-full z-20 w-full origin-top rounded-lg bg-n0 p-2 shadow-md duration-300 dark:bg-n800 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        {layoutList.map((item) => (
          <li
            onClick={() => {
              //  changeLayout(item);
              setLayout(item);
              toggleOpen();
            }}
            className={`block cursor-pointer select-none rounded-md p-2 duration-300 hover:text-primary ${
              layout == item ? "bg-primary text-n0 hover:!text-n0" : ""
            }`}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TopNav = ({
  setSidebar,
  sidebarIsOpen,
}: {
  setSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
}) => {
  const { layout } = useLayout();
  return (
    <nav
      className={`navbar-top z-20 px-4  shadow-sm duration-300 dark:border-b dark:border-n700 xxl:px-6 ${
        sidebarIsOpen
          ? "w-full xxl:w-[calc(100%-280px)] xxxl:w-[calc(100%-336px)] ltr:xxl:ml-[280px] ltr:xxxl:ml-[336px] rtl:xxl:mr-[280px] rtl:xxxl:mr-[336px]"
          : "w-full"
      }    fixed flex items-center justify-between gap-3 bg-n0 p-3 dark:bg-bg4`}
    >
      <div className="flex grow items-center md:gap-4 xxl:gap-6">
        <button onClick={() => setSidebar(!sidebarIsOpen)}>
          <IconMenu2 />
        </button>
        {/* <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden w-full max-w-[493px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-6 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-8"
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent py-2 focus:outline-none md:py-2.5 xxl:py-3"
          />
          <button>
            <IconSearch />
          </button>
        </form> */}
      </div>
      <SelectLayout />
      <div className="flex items-center gap-3 sm:gap-4 xxl:gap-6">
        {/* <ModeSwitcher /> */}
        <Notification />
        {/* <SwitchLanguage /> */}
        <Profile />
      </div>
    </nav>
  );
};

export default TopNav;
