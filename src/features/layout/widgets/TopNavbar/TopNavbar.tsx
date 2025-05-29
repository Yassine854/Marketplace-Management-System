import { IconMenu2 } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Notification from "@/features/shared/elements/TopNavBarElements/Notification";
import Profile from "@/features/shared/elements/TopNavBarElements/Profile";
import StoreSelector from "../StoreSelector/StoreSelector";
import { useLayout } from "@/utils/LayoutContext";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const layoutList = [
  "All",
  "Old Mghira",
  "Sousse",
  "Kamarket",
  "Mnihla",
  "Charguia",
  "Mghira",
];
//export const layoutList = ["All", "Tunis", "Sousse", "Kamarket" , "Mnihla", "Charguia"];

const TopNav = ({
  setSidebar,
  sidebarIsOpen,
}: {
  setSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
}) => {
  const { layout } = useLayout();
  const { notifications } = useGlobalStore();
  const [newNotification, setNewNotification] = useState(false);

  // This function will be passed to the Notification component
  const updateNotificationIndicator = (hasUnread: boolean) => {
    setNewNotification(hasUnread);
  };

  return (
    <div
      className={`dark:bg-bg1 fixed left-0 right-0 top-0 z-40 flex h-[70px] items-center justify-between border-b bg-n0 px-4 dark:border-n500 md:px-6 lg:h-[80px] ${
        layout === "horizontal" ? "lg:pl-6" : "lg:pl-[270px]"
      }`}
    >
      {/* Left Side */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          onClick={() => setSidebar(!sidebarIsOpen)}
          className="flex items-center justify-center p-2 focus:outline-none"
        >
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
      {/* <StoreSelector /> */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* <ModeSwitcher /> */}
        <div className="relative">
          {newNotification && (
            <div className="absolute right-0 h-3 w-3 rounded-full bg-red-600"></div>
          )}
          <Notification
            isWhite
            setNewNotification={updateNotificationIndicator}
          />
        </div>
        {/* <SwitchLanguage /> */}
        <Profile />
      </div>
    </div>
  );
};

export default TopNav;
