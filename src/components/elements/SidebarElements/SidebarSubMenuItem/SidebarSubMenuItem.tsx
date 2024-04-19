import { Props } from "./SidebarSubMenuItem.types";

const SidebarSubMenuItem = ({
  name = "Open Orders",
  onClick,
  isActive = false,
}: Props) => {
  return (
    <div onClick={onClick}>
      <div
        className={`block cursor-pointer px-3 py-2.5 text-sm font-medium capitalize duration-300 hover:text-primary md:py-3 lg:text-base xxxl:px-6 ${
          isActive && "text-primary"
        }`}
      >
        <span className="pr-1">•</span>
        {name}
      </div>
    </div>
  );
};

export default SidebarSubMenuItem;
