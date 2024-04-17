import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";
import { orderStatus } from "./orderStatus";

const SidebarOrders = ({ isActive, onClick }: any) => {
  return (
    <ul className=" flex flex-col gap-2 ">
      <li
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3 "
        }`}
      >
        <SidebarButton isActive={isActive} />

        <ul className={`px-3 py-3 4xl:px-5`}>
          <li onClick={() => onclick()}>
            {orderStatus.map((item, index: number) => (
              <SidebarSubMenuItem
                isActive={false}
                key={index}
                onClick={() => {}}
                name={item.name}
              />
            ))}
          </li>
        </ul>
      </li>
    </ul>
  );
};

SidebarOrders.defaultProps = {
  isActive: false,
};
export default SidebarOrders;
