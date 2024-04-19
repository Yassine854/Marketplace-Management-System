import LanguageSwitcher from "@/components/elements/TopNavBarElements/LanguageSwitcher";
import ModeSwitcher from "@/components/elements/TopNavBarElements/ModeSwitcher";
import Notification from "@/components/elements/TopNavBarElements/Notification";
import Profile from "@/components/elements/TopNavBarElements/Profile";

const TopNavBar = () => {
  return (
    <nav
      className="
      navbar-top fixed top-0 z-20 flex
      h-[90px] w-full items-center justify-end 
      gap-3 bg-n0 px-4 py-3 shadow-sm duration-300 dark:border-b
    dark:border-n700 dark:bg-bg4 md:py-4 xxl:w-[calc(100%-280px)] 
      xxl:px-6 xxl:py-6 xxxl:w-[calc(100%-336px)] ltr:xxl:ml-[280px] ltr:xxxl:ml-[336px]
      rtl:xxl:mr-[280px] rtl:xxxl:mr-[336px]"
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
