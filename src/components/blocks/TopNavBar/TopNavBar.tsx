import LanguageSwitcher from "@/components/elements/LanguageSwitcher";
import ModeSwitcher from "@/components/elements/ModeSwitcher";
import Notification from "@/components/elements/Notification";
import Profile from "@/components/elements/Profile";

const TopNavBar = () => {
  return (
    <nav
      className="px-4 xxl:px-6 py-3 shadow-sm duration-300 dark:border-b dark:border-n700 navbar-top z-20 
          w-full xxl:w-[calc(100%-280px)] xxxl:w-[calc(100%-336px)] ltr:xxl:ml-[280px] ltr:xxxl:ml-[336px] rtl:xxl:mr-[280px] rtl:xxxl:mr-[336px]
md:py-4 xxl:py-6 gap-3 bg-n0 dark:bg-bg4 fixed flex justify-end items-center h-[90px]"
    >
      <div className="flex items-center gap-3 sm:gap-4 xxl:gap-6">
        <ModeSwitcher />
        <Notification />
        <LanguageSwitcher />
        <Profile />
      </div>
    </nav>
  );
};

export default TopNavBar;
